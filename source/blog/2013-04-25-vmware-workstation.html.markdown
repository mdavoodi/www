---
page_title: "VMware Workstation"
title: "VMware Workstation"
author: Mitchell Hashimoto
tags: vagrant
---

Today, we're announcing support for [VMware Workstation](http://www.vmware.com/products/workstation/)
in addition to the VMware Fusion support we [announced in March](/blog/vagrant-1-1-and-vmware.html).

Workstation is the desktop virtualization solution that VMware provides for Linux and Windows
machines. The integration with Vagrant will allow you to run the _same virtual machines_
in VMware across Mac OS X, Linux, and Windows.

VMware technology offers improved performance, stability, and support for
those who want it, and the Vagrant integration lets you keep the same great
Vagrant workflow.

The workstation provider is [available now](http://www.vagrantup.com/vmware) for the same
price as the Fusion provider: $79 per seat. The provider will work on both Linux
and Windows. In Windows, Vagrant works in cmd.exe, PowerShell, Cygwin, and MSYS/MingW
environments.

READMORE

You can see the provider in action on Windows in the screenshot below:

<div class="align-center">
<a href="http://www.vagrantup.com/vmware" title="Vagrant + VMware">
<img alt="Vagrant + VMware Workstation on Windows" class="shadow" src="/images/blog/vmware-workstation/running.png">
</a>
</div>

