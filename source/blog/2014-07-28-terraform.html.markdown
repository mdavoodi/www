---
page_title: "Terraform"
title: "Terraform"
list_image_url: "/images/blog/terraform/small.png"
post_image_url: "/images/blog/terraform/big.png"
author: Mitchell Hashimoto
tags: terraform
---

Today we announce [Terraform](http://www.terraform.io), a tool for
safely and efficiently building, combining, and launching infrastructure.
From physical servers to containers to SaaS products, Terraform is able
to create and compose all the components necessary to run any service or
application.

With Terraform, you describe your complete infrastructure as code,
even as it spans multiple service providers. Your servers may come from
AWS, your DNS may come from CloudFlare, and your database may come from
Heroku. Terraform will build all these resources across all these
providers in parallel.

Terraform codifies knowledge about your infrastructure unlike any
other tool before, and provides the workflow and tooling for safely
changing and updating infrastructure.

We're excited to release Terraform today. The possibilities with Terraform
are deep and what we have for you today is just the beginning.

Read on to learn more.

READMORE

## How it Works

This brief explanation of how Terraform is used and operated will show how
simple and powerful Terraform is. Many technical details
are omitted on purpose since they're covered in detail in the
[complete documentation](http://www.terraform.io/docs/index.html).

Terraform is configured using a high-level, expressive configuration syntax
to describe the resources that make up your infrastructure. An example of this
configuration is shown below:

<pre class="prettyprint">
resource "digitalocean_droplet" "web" {
   name = "tf-web"
   size = "512mb"
   image = "centos-5-8-x32"
   region = "sfo1"
}

resource "dnsimple_record" "hello" {
   domain = "example.com"
   name = "test"
   value = "${digitalocean_droplet.web.ipv4_address}"
   type = "A"
}
</pre>

The configuration is declarative, and Terraform automatically infers
dependencies and uses this information to parallelize the creation of
your infrastructure as much as possible.

This example also shows how Terraform combines resources from multiple
services providers: we created a DigitalOcean Droplet and then used the
IP address of that droplet to add a DNS record to DNSimple. This sort of
infrastructure composition from code is new and extremely powerful.

Building this infrastructure is just a `terraform apply` away:

<pre class="prettyprint">
$ terraform apply
digitalocean_droplet.web: Creating...
  image:  "" => "centos-5-8-x32"
  name:   "" => "tf-web"
  region: "" => "sfo1"
  size:   "" => "512mb"
digitalocean_droplet.web: Creation complete
dnsimple_record.hello: Creating...
  domain: "" => "example.com"
  name:   "" => "test"
  type:   "" => "A"
  value:  "" => "104.131.142.132"
dnsimple_record.hello: Creation complete

Apply complete! Resources: 2 added, 0 changed, 0 destroyed.
</pre>

## Safely Iterating with Execution Plans

Terraform has a feature that is critical for safely iterating infrastructure:
_execution plans_. Execution plans show you what changes Terraform plans
on making to your infrastructure. These plans can then be saved and
applied, ensuring Terraform will _only execute what is in the plan_.

As a result, you know exactly what Terraform will do to your infrastructure
to reach your desired state, and you can feel confident that Terraform
won't surprise you in unexpected ways.

For example, after creating the example above, we can change the size of
the DigitalOcean Droplet, and see what Terraform would do. The `~` before
the Droplet means that Terraform will update the resource in-place, instead
of destroying or recreating.

<pre class="prettyprint">
$ terraform plan
~ digitalocean_droplet.web
    size: "512mb" => "1gb"
</pre>

Terraform is the first tool to have this feature of the tools which can
be considered similar to Terraform, and its a feature we consider
necessary when making changes to real systems.

## Incredible Possibilities

Terraform is capable of so much more than is immediately visible on the
surface. Historically, tools similar to Terraform have only dealt with
creating low-level compute, storage, and networking resources. But because
Terraform can bridge the gap between multiple service providers,
Terraform can do a lot better.

In the example below, we use Terraform to describe all the components
necessary to run an application on Heroku, including Heroku addons,
application configuration, and DNS entries. Imagine cloning a service from
version control, running `terraform apply`, and having everything you need
to deploy your application ready to go. Terraform does this.

<pre class="prettyprint">
resource "heroku_app" "web" {
    name = "terraform-www"

    config_vars {
        GITHUB_TOKEN = "TOKEN"
        TF_VERSION = "0.1"
    }
}

resource "heroku_domain" "web" {
    app = "${heroku_app.web.name}"
    hostname = "www.terraform.io"
}

resource "heroku_addon" "webhooks" {
    app = "${heroku_app.web.name}"
    plan = "deployhooks:http"
    config {
        url = "http://hooks.hashicorp.com/heroku"
    }
}
</pre>

The above is actually the Terraform configuration we used to build
and launch the official [Terraform website](http://www.terraform.io).

## HashiCorp Built

At HashiCorp, we build solutions to DevOps problems that are technically
sound and are a joy to use. We don't take shortcuts with the technologies
we choose, and just as importantly we don't take shortcuts in the
experience of using and operating our tools. Terraform is no different.

Terraform is the fifth such tool we've built. Previously, we've built
[Vagrant](http://www.vagrantup.com),
[Packer](http://www.packer.io),
[Serf](http://www.serfdom.io), and
[Consul](http://www.consul.io).
Terraform works great with our other tools, but doesn't require the use of
any of them.

## Learn More

To learn more about Terraform, please visit the Terraform website. The
following pages in particular are good next steps:

* [Intro](http://www.terraform.io/intro/index.html) -
  The intro section explains in more detail what Terraform is,
  how it works, and includes a brief getting started guide so you can
  quickly play with Terraform on your own machine to see just how easy it
  is to use.

* [Comparison to other software](http://www.terraform.io/intro/vs/index.html) -
  If you'd like to know how Terraform is different from similar tools
  out there, take a look at this page where we go into detail on the
  differences.

* [GitHub](https://github.com/hashicorp/terraform) -
  The source code for Terraform is hosted on GitHub here if you want to
  dive right in. We recommend reading the documentation before diving into
  code, since an understanding of how Terraform works will help greatly in
  understanding the implementation.
