---
page_title: "Vagrant Up and Running with VMware’s Project Photon"
title: "Vagrant Up and Running with VMware’s Project Photon"
list_image_url: /images/blog/vagrant-vmware-photon/vagrant.png
post_image_url: /images/blog/vagrant-vmware-photon/vagrant-vmware-photon.png
tags: vagrant, vmware
author: Kevin Fishner
---

Project Photon by VMware is a container-optimized Linux operating system that was [announced today](http://www.vmware.com/go/cloud_native). We have packaged it as a [Vagrant](https://www.vagrantup.com?utm_source=Photon) box to make experimenting with Photon using Vagrant an easy and enjoyable process.

READMORE

_Note:_ This guide requires that you have at least [VMware Fusion](http://www.vmware.com/products/fusion) 5.x+ or [VMware Workstation](http://www.vmware.com/products/workstation) 9.x+ installed. You must also have the corresponding [Vagrant VMware plugin](https://www.vagrantup.com/vmware/) installed in Vagrant with a valid license.

1. First, clone the [example repository from GitHub](https://github.com/hashicorp/photon-vagrant):

        $ git clone https://github.com/hashicorp/photon-vagrant.git

1. Next, cd into the cloned project directory and run the appropriate `vagrant up` command for your VMware product:

        $ vagrant up --provider vmware_fusion
        $ vagrant up --provider vmware_workstation

    _Note:_ If you see an error regarding "configure_networks", it can be ignored.

1. Run `vagrant ssh` to establish a secure shell connection to the Photon OS:

        $ vagrant ssh

    Now you have access to a container-optimized Linux operating system with Docker and Rkt already installed!

1. Test it out by running a Docker container:

        $ docker run -d -p 80:80 tutum/apache-php

1. Navigate to `http://localhost` in your browser and see the welcome screen:

    _Note:_ Vagrant is forwarding the port (see the `Vagrantfile` for more information). If another process is using port 80, you may see an error and need to choose a different port.


Since VMware's Photon has rkt installed as well, simply run `rkt` to view the possible commands.

That’s it — you can now experiment with building, testing, and running containers in a lightweight development environment with Vagrant and Project Photon!
