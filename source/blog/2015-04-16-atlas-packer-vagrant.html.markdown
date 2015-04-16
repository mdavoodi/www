---
page_title: "Packer in Atlas: Automate the Building and Managing of Vagrant Boxes and Machine Images"
title: "Packer in Atlas: Automate the Building and Managing of Vagrant Boxes and Machine Images"
list_image_url: /images/blog/atlas/atlas-logo.png
post_image_url: /images/blog/atlas-packer/build_header.png
tags: atlas, packer, vagrant
author: Jack Pearkes
---

Today we are announcing [Packer](https://packer.io) integration
with [Atlas](https://atlas.hashicorp.com/?utm_source=Packer-Atlas).
Automate remotely running Packer builds,
store and version artifacts, and quickly distribute
Vagrant boxes to your team or the community.

Packer is an open source project by HashiCorp for building machine images.
It can build AMIs, Virtualbox images, Docker images, Vagrant boxes and
more, with a broad range of support for both machine and cloud provider images.

With Packer now integrated with Atlas, builds can be run remotely and the
resulting artifacts, such as Vagrant boxes, can be easily stored in Atlas.
Developer machines or other environments can now be freed from running Packer builds.
Logs for the build and storage process are kept in Atlas to provide a full history
of artifact changes, so a single person or an entire team can audit changes in a
simple web interface.

Read on to learn more and see screenshots of Packer + Atlas in action.

READMORE

## Getting Started

You can get started with Atlas and Packer right now. We've created
an interactive tutorial to guide you every step of building and storing
a Vagrant box in Atlas. Vagrant boxes are just one type of artifact — you can
also build and store AMIs, Docker containers, DigitalOcean images, and more.

Visit the [interactive tutorial](https://atlas.hashicorp.com/tutorial/packer-vagrant?utm_source=Packer-Atlas)
to get started today, or read below for more details on Packer and
its integration with Atlas.

## Vagrant box Creation and Management

Following a [`packer push`](https://www.packer.io/docs/command-line/push.html)
of your template and associated configuration files,
Atlas will automatically run Packer to build and provision the Vagrant box, and then
post-process the resulting box to store it in Atlas.

![Packer push](images/blog/atlas-packer/packer_push.png)

Packer push allows users – in a single step – to modify base configuration
and provisiong scripts to make new Vagrant box versions. Vagrant boxes can be
private or public, and both benefit from versioning and storage.

After `packer push`, anyone with access to the Vagrant box can use the build UI
to view the progress of the build in real-time. These logs are persisted
and saved.

![Active Build](/images/blog/atlas-packer/build_header.png)

When a build completes, any created boxes are automatically uploaded
to Atlas and made available to users.

![Uploaded Box](/images/blog/atlas-packer/uploaded_box.png)

This box is also available through the traditional Vagrant box management
UI in Atlas. It is then available to anyone who has the box installed locally,
either with a `vagrant init` or `vagrant box outdated`.

## The Future

Building and storing Vagrant boxes is just one feature of Packer in Atlas.
We currently have support for the following Packer builders:

```
amazon-chroot
amazon-ebs
amazon-instance
digitalocean
docker
qemu
virtualbox-iso
vmware-iso
```

Within the month, Atlas will integrate with GitHub so that when a Packer
template changes in GitHub, it automatically triggers a new Packer build in
Atlas. Combining automated Packer builds with automated Terraform runs based
on artifact changes lays the foundation for automating and managing
immutable infrastructure.

Atlas is our commercial product currently in tech preview. We will be
announcing pricing soon. When Atlas pricing is announced, there will be
a generous free tier, so you don't need to worry about being charged for
playing with Atlas. If you're using Atlas at a larger scale and have concerns,
email us at
<a href="mailto:hello@hashicorp.com">hello@hashicorp.com</a> and we'd
be happy to talk with you.
