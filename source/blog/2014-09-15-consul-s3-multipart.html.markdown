---
page_title: "Atomic Multi-Part S3 Uploads with Consul"
title: "Atomic Multi-Part S3 Uploads with Consul"
list_image_url: "/images/s3-upload-fail.png"
author: Armon Dadgar
tags: consul
---

[Vagrant Cloud](https://vagrantcloud.com) is a service provided
by HashiCorp, and powers a number of features for Vagrant that
cannot be done without a server component. One of it's paid features
is box hosting, allowing Vagrant boxes to be hosted and managed
in Vagrant Cloud. We had received several reports that uploading
very large Vagrant boxes would fail reliably, and we spend part of last
week resolving this issue. We use S3 as one of our backing stores, and
eventually it was discovered that S3 limits the size of a single upload
to 5GB.

READMORE

HashiCorp has a service oriented infrastructure, and the binary
storage pipeline involves our BinStore and StorageLocker services.
StorageLocker provides location transparency for our binary storage,
and speaks a simple streaming RPC protocol. Its API consists of:

* Put(Key, Value) -> Address
* Get(Address) -> Value
* Delete(Address)

This allows our internal services to easily store and retrieve
large payloads without worrying about the specifics of the backend
storage system, allowing us to do transparent compression, caching,
checksums, and replication even when running as part of our on premise
product. BinStore is a public facing service
that speaks HTTP, and provides an authenticated way to expose
StorageLocker to the world.

<div class="align-center">
  <img src="/images/storage-arch.png" alt="Storage Architecture"></img>
</div>

Given this context, the logical place to fix our upload limitation
was in StorageLocker, but even here we had a choice. We could use the
native [S3 multi-part upload API](http://docs.aws.amazon.com/AmazonS3/latest/dev/uploadobjusingmpu.html),
or we could build that logic into StorageLocker instead. Using the native
API requires initiating the upload, uploading each part, and then completing
or aborting the upload. If we squint, this starts to look like a transaction:
we have a begin, modify some data, then finally commit or abort.

With a single object upload, we automatically get atomicity: either the object
uploads or it doesn't. However with a multi-part upload we introduce
partial failure states. It's possible some of our parts don't upload, or
maybe they all upload but we fail to commit or abort. It's possible for
StorageLocker to crash, or for our datacenter to lose connectivity mid-upload.
The number of potential error cases are too many to enumerate.

<div class="align-center">
  <img src="/images/s3-upload-fail.png" alt="S3 Upload Failure"></img>
</div>

In a traditional RDBMS, our transaction takes place in the context of
a persistent connection to the database. If we fail in the middle of the
transaction, the DB ensure the transaction is aborted and thus atomicity
is preserved. However with S3, there is no way for AWS to detect a failure
of the client, it just looks like a partially completed upload, and no
automatic abort is performed. This makes aborting an upload and ensuring
atomicity the client's problem.

AWS provides an API to list any in-progress uploads, which we can periodically
fetch and use to abort any uploads that have been pending for too long.
While this is a heuristic, it's very unlikely that any uploads pending for multiple
days are active.

Stepping back, we've determined it is possible to get atomicity for
multi-part uploads using just the S3 API. However, all of this would be
S3 specific including a service to manage aborting the failed uploads.
At this point, we started thinking about other solutions
generic enough to use with our other storage backends.

If we want a mechansim to do multi-part uploads while being agnostic
of the storage backend, then we cannot depend on the S3 specific APIs.
This is especially important as we must maintain feature parity with
our on premise product, where S3 may not be an available backing store.
Most key/value stores suitable for streaming large binaries don't expose
transactional concepts. This means we can't depend on our backends to
provide atomicity for multiple keys.

## Put a WAL on it

In the world of databases, providing atomicity is usually a critical
requirement. Most databases do this by making use of a technique called
[Write-Ahead-Logging (WAL)](http://en.wikipedia.org/wiki/Write-ahead_logging).
While a mouthful, the intuition behind it is simple: mark what you intend to
do, attempt to do it, mark if you succeeded or aborted. WAL's are used
to recover from partial failures by enabling an operation to be rolled back
and the state to be restored to a pristine condition.

At first stab, this looks like a suitable technique for our multi-part
upload problem. We simply maintain a WAL of the parts to upload and
recovery from a partial-failure just requires deleting the parts. However,
we now have another problem: what if we lose the machine with the WAL
on it? In the case of a traditional database the point is moot since
the data is stored alongside the WAL so there is no cleanup to perform.
If we lose our WAL, our data still exists in S3 but now recovery is impossible.

This is where [Consul](http://www.consul.io) comes in. Consul is a solution
for service discovery, configuration and orchestration. One of its key features
is a distributed key/value store. Consul ensures the data it manages is highly
available and durable by replicating it to multiple nodes. From a client
perspective, we can write to it and be confident that we won't lose data during
a node failure.

To guard against losing the node running StorageLocker and the WAL with it,
we simply store the WAL in Consul. Now if the StorageLocker instance handling
an upload fails, the WAL is available via Consul to any other instance.
Recovery is done by fetching all the expired WALs and deleting all the parts
from the respective backends. Expiration is managed like the S3 case, by applying
a time based heuristic. We don't expect any uploads to span multiple days, made
further unlikely since we timeout an upload much earlier.

<div class="align-center">
  <img src="/images/s3-consul-upload.png" alt="S3 Consul Upload"></img>
</div>

## The Devil is in the Details

While we've covered the solution in broad strokes, we will cover the specifics
of each operation subtlety in the details. Logically, we start the workflow
with the Put operation:

1. If the file size is below a configurable `ChunkSize`, upload as a single part, done.
2. Compute the number of chunks based on the `ChunkSize`
3. Create a WAL entry that looks like:

        {
            "ID": "<Random UUID>",
            "Start": <Timestamp>,
            "URLs": [
                "<Chunk 0 URL>",
                ...,
                "<Chunk N URL>",
                "Metadata file"
            ],
        }

4. Write the WAL entry to Consul (we store it at `service/storagelocker/wal/<ID>`)
5. Upload all the parts
6. Write the metadata file, which is contains the file size, check sums,
   and addresses of all the parts.
7. Delete our WAL entry, which acts as our commit.
8. If an error is encountered at any step, abort the upload, delete all the parts,
   and then delete the WAL.

This is the pseudo code for our atomic upload. We make use of Write-Ahead-Logging
so that we can safely roll back any partial uploads, and we store our log on Consul
to guard against a node failure. To handle node failure, all of our StorageLocker instances
do a periodic scan for abandoned WAL entries and go to step 8, invoking
the same error handling logic.

Deleting a key also has the same issue since we don't want to keep around
partially deleted objects. Handling delete is similar to put:

1. If the file has only a single part, delete it normally, done.
2. Fetch the metadata file (given by the URL).
3. Create a WAL entry, exact same format as Put except that the URLs
   are given by the Metadata file instead of being computed, and include
   the metadata file.
4. Write the WAL entry to Consul
5. Delete all the parts, including the metadata file.
6. Delete our WAL entry, committing the delete.
7. If an error is encountered, abort the delete, invoking recovery logic.
   In this case, likely the delete will need to retried later using the
   standard WAL recovery built in.

By having both Put and Delete use the same format for the WAL entry,
we can use the same recovery logic. By lucky coincidence, the recovery
for both types of failures is to simply delete all the corresponding
parts.

The last operation is a Get, which is much simpler since it is idempotent.
This means there is no need for cleanup or recovery logic in the case
of an error, so the flow is simply:

1. If the file has only a single part, fetch it normally.
2. Fetch the Metadata file (given by the URL).
3. Fetch each part sequentially.

Within StorageLocker, we make use of an `Engine` interface, where
each concrete implementation is used for a particular backend. For example
the `S3Engine` stores data in S3. By implementing
the `WALEngine` we can compose it with any other engine, enabling
all of our backends to transparently support multi-part uploads without
sacrificing atomicity.

Our changes to StorageLocker have been implemented and rolled out
to Vagrant Cloud, so happy uploading!

