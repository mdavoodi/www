---
page_title: "Vagrant Up and Running with VMware’s Project Photon"
title: "Vagrant Up and Running with VMware’s Project Photon"
list_image_url: /images/blog/vagrant-vmware-photon/vagrant.png
post_image_url: /images/blog/vagrant-vmware-photon/vagrant-vmware-photon.png
tags: vagrant, vmware
author: Kevin Fishner
---

Project Photon by VMware is a container-optimized Linux operating system that was [announced today](http://www.vmware.com/go/cloud_native). We’ve packaged it as a [Vagrant](https://www.vagrantup.com) box to make experimenting with Photon an easy and enjoyable process. Below is the process to test out running containers on Photon:

READMORE

_Note this guide requires that you have at least [VMware Fusion](http://www.vmware.com/products/fusion) 5.x+ or [VMware Workstation](http://www.vmware.com/products/workstation) 9.x+ installed and have the corresponding [Vagrant VMware plugin](https://www.vagrantup.com/vmware/)._

1. `git clone git@github.com:hashicorp/photon-vagrant.git`
2. Cd into the repo and run `vagrant up --provider vmware_fusion` or `vagrant up --provider vmware_workstation`. If you receive an error regarding 'configure_networks', it can be ignored and continue to the next step.
3. Run `vagrant ssh` to ssh into the VM

You now have access to a container-optimized Linux system with Docker and Rkt already installed. Test out running a Docker container:

4. `docker run -d -p 80:80 tutum/apache-php` to run an apache-php Docker container
5. Navigate to `http://localhost:80` in your browser to see the welcome screen
6. Photon has rkt installed as well, so simply run `rkt` to view the possible commands

That’s it — you can now experiment with building, testing, and running containers in a lightweight development environment with Vagrant and Project Photon. 
