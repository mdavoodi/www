---
page_title: "Packer in Atlas: Automate the building and management of Vagrant Boxes"
title: "Packer in Atlas: Automate the building and management of Vagrant Boxes"
list_image_url: /images/blog/atlas/atlas-logo.png
post_image_url: /images/blog/atlas-packer/build_header.png
tags: atlas, packer, vagrant
author: Jack Pearkes
---

Today we are announcing [Packer](https://packer.io) integration
with [Atlas](https://atlas.hashicorp.com/?utm_source=Packer-Atlas). With
Atlas + Packer integration, you can automate the remote running of Packer builds,
store and version artifacts automatically, and quickly distribute
Vagrant boxes to your team or the community.

Packer is an open source project by HashiCorp for building machine images.
It can build AMIs, Virtualbox images, Docker images, Vagrant boxes and
more, with a broad range of support for both machine and cloud provider images.

With the Atlas integration, You can now run and store the resulting
artifacts, such as Vagrant boxes, from these builds all remotely,
viewing logs and history from a web interface for a single person or an entire team.

This frees up resources and environments used for Packer build pipelines,
be it on a CI or locally on a developer machine, and enables a consistent,
verifiable history for all of your images and boxes.

Read on to learn more and see screenshots of this in action.

READMORE

## Vagrant Box Creation and Management

Following a [`packer push`](https://www.packer.io/docs/command-line/push.html)
of your template and associated configuration,
Atlas will automatically run your Packer build and provisioning, as well
as any post-processors, including uploading Vagrant boxes.

![Packer push](images/blog/atlas-packer/packer_push.png)

This allows you – in a single step – to modify your base box configuration
 and provisiong scripts and make new versions of your Vagrant box available
 to anyone who uses it.

After pushing, you or anyone in your organization can use the build UI to
view the progress of the build in realtime. These logs are persisted
and saved.

![Active Build](/images/blog/atlas-packer/build_header.png)

When a build completes, any artifacts created will be automatically uploaded
to Atlas, including boxes. Boxes that don't exist will be automatically
created, and boxes will automatically release and become available to
your users.

![Uploaded Box](/images/blog/atlas-packer/uploaded_box.png)

This box is also available through the traditional Vagrant box management
UI in Atlas. It is then available to anyone who has the box installed locally,
either with a `vagrant init` or `vagrant box outdated`.

## Getting Started

You can get started with Atlas and Packer right now. We've created
an interactive tutorial to guide you every step of the way. You don't even
need an Atlas account to begin!

Visit the [interactive tutorial](https://atlas.hashicorp.com/tutorial/packer-vagrant?utm_source=Packer-Atlas)
to get started today.

## The Future

This is just one small part of Packer in Atlas. We currently have support
for the following Packer builders:

```
amazon-chroot
amazon-ebs
amazon-instance
digitalocean
docker
openstack
parallels-iso
parallels-pvm
qemu
virtualbox-iso
vmware-iso
```

Within the month, we'll be integrated with GitHub so that your Packer
template changes pushed to GitHub automatically are sent/triggered
in Atlas. Combining this with Terraform runs based on artifact changes
can go very far in automating and managing image deployment.

Atlas is our commercial product currently in tech preview. We will be
announcing pricing soon. When Atlas pricing is announced, there will be
a generous free tier, so you don't need to worry about being charged for
playing with Atlas. If you're using Atlas at a larger scale and have concerns,
email us at
<a href="mailto:hello@hashicorp.com">hello@hashicorp.com</a> and we'd
be happy to talk with you.
