---
page_title: "Atlas: Artifact Pipeline and Image Deploys with Packer and Terraform"
title: "Atlas: Artifact Pipeline and Image Deploys with Packer and Terraform"
list_image_url: /images/blog/atlas/atlas-logo.png
post_image_url: /images/blog/atlas-artifacts/triggered.png
tags: atlas, terraform
author: Jack Pearkes
---

In this post, we wanted to highlight an Atlas feature that connects Packer to
Terraform to automate and track image deployments across providers
like AWS, Openstack, Azure and DigitalOcean.

Atlas builds upon and unites HashiCorp open source tooling to _automate
and audit infrastructure changes across providers_. Atlas supports a workflow
and user interface powered by our OSS projects that are used by organizations
across the industry to manage infrastructure, developer workflows and
perform operational tasks. Essentially, this means connecting all of the plumbing
that each tool performs.

In this real-world example we'll show you a service deployed to AWS with an
AMI. Atlas _uses itself to manage it's own infrastructure_, and in this case the service
being deployed is called "logstream". Logstream, as the name implies, is
responsible for streaming logs from Packer builds and Terraform runs to
JavaScript to be displayed in the Atlas UI, pictured in screenshots throughout
this post.

Logstream is a simple Go application that is proxied via an ELB,
performing routing and SSL termination. It's designed to be stateless
and can scale horizontally with increased load.

### Creating the Image

Packer is used to create the AMI and performs buildtime configuration
with Puppet. At runtime, Consul Template configures the specific services
on the instance. This balance uses the strengths of the various
tools – Puppet handles installing dependencies, laying down files and preparing
the operating system, while Consul Template renders the configuration
for the Logstream service by watching for changes in the Consul
key/value store.

This is done with Packer provisioners prior to baking the image – Puppet
is not used on the production machine. This allows operators
to roll configuration changes out instantaneously for specific
keys and services by updating values in the Consul web UI or via the API,
but still focuses on up-front buildtime configuration. The biggest benefit
of this is fast launch times, stateless startup and elimination of configuration
drift.

Packer uses "Packer templates" to define the process of creating the image
in a reproducible way. That looks something like this:

    "builders": [
        {
          "type": "amazon-ebs",
          ...
        }
    ]
    "provisioners": [
        {
          "type": "puppet-masterless",
          ...
        }
    ],
    "post-processors": [
        {
          "type": "atlas",
          "artifact": "hashicorp/logstream",
          "artifact_type": "amazon.ami"
        }
    ]

After pushing the Packer template and associated
provisioning files to Atlas, Atlas starts building the instance and
uploads the resulting artifact (an AMI ID) to the Atlas artifact
registry, all without running Packer on any operator machine.

Logs and a history of this image creation process are preserved with
visibility for the whole organization, as pictured in the screenshot
below.

![Packer building logstream in the Atlas UI](/images/blog/atlas-artifacts/build-artifact.png)

Packer is an popular open source project made by HashiCorp that handles all image
creation in Atlas – the same configuration format used when building in
Atlas can be used locally, and is fully portable between environments.

### Deploying the Image with Terraform

Terraform is used to safely deploy the new service. It does this by using
Terraform "Providers" such as `aws_instance` or `aws_launch_configuration`,
 which have distinct knowledge of deployment and image rolling requirements.

In the case of AWS, an AMI is used as the identifier for the created image –
as long as the AWS account launching the image has access to the resulting
AMI from the Packer build, it can be used during the deploy phase.

The Atlas artifact registry is used to store and version the artifact –
in this case an AMI identifier – in order to automate and describe the
Artifact dynamically. In the following example, the Terraform
`atlas_artifact` provider is a pointer to the latest AMI ID created
by the Logstream build.

    resource "atlas_artifact" "logstream" {
        name = "hashicorp/logstream"
        version = "latest"
    }


Without the Atlas artifact registry, this might require an AMI ID to be
copied manually into Terraform configuration from the AWS console or Packer
output. With the registry, changes to Terraform configuration are not
required after new AMIs are created.

This is an example of referencing the Atlas artifact in Terraform
configuration.

    resource "aws_launch_configuration" "logstream" {
        name = "logstream"
        image_id = "${atlas_artifact.logstream.metadata_full.region-us-east-1}"
    }

With this configuration, Terraform will detect the new version of Logstream
on refresh and generate a diff. When `terraform apply` is run,
Terraform will change the underlying instance or AutoScaling Group
to use the new AMI.

### Automatic Triggering with Atlas

If you're running Packer builds and collaborating on Terraform in Atlas,
plans will automatically be queued following builds completing and
artifacts being uploaded. This extends the above example using the
registry to also trigger based on registry changes, further automating
parts of the pipeline.

Following a completed build of the Logstream image, the Atlas UI below
shows the automatically triggered `terraform plan`.

![Terraform plan in Atlas queued by completed build](/images/blog/atlas-artifacts/confirm-artifact.png)

The plan is now waiting for a human operator to confirm and apply the
change.

This allows operators to follow the cause of the change and determine
why the infrastructure needs to be modified. Instead of manually referencing
the artifact, updating it after a build and triggering a new plan,
the whole process is automated and visible to the entire organization.

### Getting Started

There are a number of places to start building out a pipeline
similar to this. Because of Packer and Terraform
being agnostic to specific tools or technologies, you can begin
implementing with existing configuration management, cloud
providers or containers.

We recommend following the guide for [Creating AMI Artifacts with Atlas](https://atlas.hashicorp.com/help/packer/artifacts/creating-amis)
in the Atlas help, or reading [about Atlas](https://atlas.hashicorp.com/help).

In future posts, we'll continue detailing aspects of this pipeline,
including notifications to Slack, Email, and Hipchat at each stage
of builds and deployment.

_Note: There is currently a beta feature that further
automates this pipeline, automatically deploying the images as they
are changed without human confirmation. This is experimental, and detailed
[here](https://atlas.hashicorp.com/help/terraform/runs/automatic-applies)._

