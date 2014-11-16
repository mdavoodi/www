---
page_title: "Automated Pre-Provisioned Development Environments"
title: "Automated Pre-Provisioned Development Environments"
list_image_url: /images/blog/automated-environments/side.png
post_image_url: /images/blog/automated-environments/header.png
author: Jack Pearkes
tags: vagrant-cloud, packer
---

[Vagrant](http://www.vagrantup.com) was introduced in 2010 to make
creating, sharing and interacting with development environments
simple and reproducible.

Today, Vagrant environments provisioned from base boxes give teams
a simple and cross-platform way to distribute an environment. However, even
after a development environment is created, it often needs to be provisioned
by Chef, Puppet or other software on each developer machine. Provisioning
this many times can be fragile and slow, causing delays, frustration and bugs
in an environment.

After Vagrant was first released, the community
immediately began to build and share boxes with the development
environment software already provisioned. Boxes enabled teams to share
a whole package containing everything a developer needed. The community
had made it clear that this was an important next step for Vagrant by
building external tools and workflows to support it. Vagrant itself has
always had a `vagrant package` command to turn the running development
environment into a distributable box.

In 2013, we introduced [Packer](http://www.packer.io), a solution for
automating the creation of various types of machine images, both for
cloud providers like Amazon, and local hypervisors such as VirtualBox
and VMware. An important distinction between Packer and `vagrant package`
is that Packer began targeting production environments, as well.

Packer was rapidly adopted to streamline the workflow we were starting
to learn – build an immutable machine image for a specific environment and
distribute it a team working in development, or even to staging and production.

There was still challenges in the workflow, though. The process of
getting boxes to your team and keeping them up to date
was still painful, and a point of persistent feedback for us.

Vagrant 1.5 introduced an entirely redesigned box system to fix some of
these problems. Namely, box versioning became a fully built-in feature, along with
richer metadata and formatting to describe box providers. To take full
advantage of these features, we launched [Vagrant Cloud](https://vagrantcloud.com)
alongside Vagrant 1.5.

Vagrant Cloud gave Vagrant a connection to an external, updatable resource.
Box maintainers can update a machine image, and developers are notified
of the images changes and can download and update their machines at will.

For developers, maintaining an updated development environment meant
running one command after receiving automatic notifications during their
daily interactions with Vagrant.

But the process still wasn't perfect. Box maintainers could build
machines with Packer, but they still had to interact with Vagrant Cloud
web UI, and find somewhere to host the box files.

With the introduction of the [Vagrant Cloud Post-Processor](http://www.packer.io/docs/post-processors/vagrant-cloud.html)
 alongside improvements to Vagrant Cloud, Packer runs can now conclude
with the update and release of your `.box` files to your entire team.

![Example of a Vagrant Cloud Post-Processor run in Packer](/images/blog/automated-environments/pp-run.png)

We're proud to close this circle. Box maintainers can now build, upload, release
and distribute development environments that are already provisioned to
their entire team with a single Packer run.

Here's an example Packer template using the new post-processor.

    {
      "variables": {
        "cloud_token": "",
        "version": ""
      },
      "builders": [
        {
          "type": "virtualbox-ovf",
          "source_path": "tmp/box.ovf",
          "headless": true,e
          "shutdown_command": "sudo -S shutdown -P now,
          "ssh_username": "vagrant",
          "ssh_password": "vagrant",
          "ssh_wait_timeout": "30s",
          "vm_name": "webcore"
        }
      ],
      "provisioners": [
        {
            "type": "puppet-masterless",
            "manifest_file": "site.pp"
        }
      ],
      "post-processors": [
        [{
          "type": "vagrant",
          "output": "webcore-{{.Provider}}.box"
        },
        {
          "type": "vagrant-cloud",
          "box_tag": "pearkes/webcore",
          "access_token": "{{user `cloud_token`}}",
          "version": "{{user `version`}}"
        }]
      ]
    }


On the developer end, you're notified of an available upgrade
during your normal Vagrant workflow.

![Example of an update notification in Vagrant](/images/blog/automated-environments/update-notification.png)

### Conclusion

We are very proud of how this tooling now integrates to provide continuity to
the highly automated creation and distribution of developer environments.

To start building and releasing pre-provisioned development environments,
see the following resources:

- [Packer Intro](http://www.packer.io/intro)
- [Vagrant Cloud](https://vagrantcloud.com)
- [Vagrant Cloud Packer Post-Processor](http://www.packer.io/docs/post-processors/vagrant-cloud.html)
- [Getting Started With Vagrant](http://docs.vagrantup.com/v2/getting-started/index.html)
- [Vagrant Boxes Documentation](http://docs.vagrantup.com/v2/boxes.html)
