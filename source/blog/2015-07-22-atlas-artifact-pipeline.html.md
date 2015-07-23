---
page_title: "Atlas: Artifact Pipeline and Image Deploys with Packer and Terraform"
title: "Atlas: Artifact Pipeline and Image Deploys with Packer and Terraform"
list_image_url: /images/blog/atlas/atlas-logo.png
post_image_url: /images/blog/atlas-artifacts/triggered.png
tags: atlas, terraform
author: Jack Pearkes
---

In this post, we will highlight an [Atlas](https://atlas.hashicorp.com)
feature that connects [Packer](https://packer.io)
with [Terraform](https://terraform.io) to automate and track image deployments across
infrastruture providers like AWS, Openstack, Azure and DigitalOcean.

Atlas builds upon and unites HashiCorp's open source tooling to
_automate and audit infrastructure changes across providers_. Vagrant,
Packer, Terraform, Consul, and Vault are connected to create and
establish a workflow that enables organizations to not only manage
infrastructure, but audit and collaborate on those changes in a central
location. This post will focus on using Atlas to connect Packer and
Terraform to create an automated pipeline for building and deploying
artifacts and immutable infrastructure.

This real-world example will demonstrate deploying a service to AWS with
an AMI. We use Atlas to manage Atlas' infrastructure, and this post will
walkthrough deploying our "logstream" service. Logstream is a component
of Atlas that streams logs from Packer builds and Terraform runs to
JavaScript in the Atlas UI. These logs are pictured in screenshots
throughout this post.

Logstream is a simple Go application that is proxied via an ELB, which
performs routing and SSL termination. It is designed to be stateless and
horizontally scalable under increased load.

First, Packer runs in Atlas to build the Logstream AMI. This artifact
output is then stored in Atlas' artifact registry, namespaced, and
versioned under `hashicorp/logstream`. Terraform then reads from the
artifact registry and deploys new instances using this AMI. When the
Logstream AMI is updated, the process starts again – continuous delivery
for immutable infrastructure.

### Creating the Image

Packer is used with Puppet to create the Logstream AMI. Packer
automatically provisions an instance in AWS, runs the Puppet modules to
configure the machine, snapshots the machine to create an image, stores
that image, and then terminates the machine. All of this is done at
build-time, which eliminates configuration drift, speeds up deploys, and
reduces risk. For any runtime configuration, Logsteam (and all of our
services) use [Consul Template](https://github.com/hashicorp/consul-template).
This balance uses the strengths of the various tools – Puppet
handles installing dependencies, laying down files, and preparing the
operating system, while Consul Template renders the configuration for
the Logstream service by watching for changes in the Consul key/value
store.

This allows operators to roll configuration changes out instantaneously
for specific keys and services by updating values in the Consul web UI
or via the API, but still focuses on up-front build-time configuration.

Packer uses "Packer templates" to define the process of creating the
image in a reproducible way. That looks something like this:

    "builders": [
        {
          "type": "amazon-ebs",
          ...
        }
    ],
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

After pushing the Packer template and associated provisioning files to
Atlas, Atlas starts and provisions the instance and uploads the
resulting artifact (an AMI ID) to the Atlas artifact registry, all
without running Packer on an operator machine.

Logs and history of this image creation process are preserved with
visibility for the whole organization, as pictured in the screenshot
below.

![Packer building logstream in the Atlas UI](/images/blog/atlas-artifacts/build-artifact.png)

Packer is an popular open source project made by HashiCorp that handles
all image creation in Atlas – the same configuration format used when
building in Atlas can be used locally, and is fully portable between
environments.

### Deploying the Image with Terraform

[Terraform](https://terraform.io) is a HashiCorp tool for automating
infrastructure provisioning. Terraform is used to safely deploy the
Logstream service defined in the Packer-built AMI above. It does this by
using Terraform "Provider Resources" such as `aws_instance` or
`aws_launch_configuration`,  which have distinct knowledge of deployment
and image rolling requirements.

In the case of AWS, an AMI is used as the identifier for the created
image – as long as the AWS account launching the image has access to the
resulting AMI from the Packer build, it can be used during the deploy
phase.

The Atlas artifact registry is used to store and version the artifact –
in this case an AMI identifier – in order to automate and describe the
artifact dynamically. In the following example, the Terraform
`atlas_artifact` resource is a pointer to the latest AMI ID created by
the Logstream build.

    resource "atlas_artifact" "logstream" {
        name = "hashicorp/logstream"
        version = "latest"
    }


Without the Atlas artifact registry, this would require an AMI ID to be
copied manually into Terraform configuration from the AWS console or Packer
output. With the registry, Terraform configuration changes are not
required after new AMIs are created.

This is an example of referencing the Atlas artifact in Terraform
configuration.

    resource "aws_launch_configuration" "logstream" {
        name = "logstream"
        image_id = "${atlas_artifact.logstream.metadata_full.region-us-east-1}"
    }

With this configuration, Terraform will detect the new version of the
Logstream artifact on refresh and generate a diff during the `terraform
plan`. When `terraform apply` is run, Terraform will change the
underlying instance or AutoScaling Group to use the new AMI.

### Automatic Triggering with Atlas

If you are running Packer builds and collaborating on Terraform in
Atlas, a successful Packer build can automatically queue Terraform
plans. This extends the above example using the registry to also trigger
based on registry changes, further automating parts of the pipeline.

Following a completed build of the Logstream image, the Atlas UI below
shows the automatically triggered `terraform plan`.

![Terraform plan in Atlas queued by completed build](/images/blog/atlas-artifacts/confirm-artifact.png)

The plan is now waiting for a human operator to confirm and apply the
change.

This allows operators to follow the cause of the change and determine
why the infrastructure needs to be modified. Instead of manually
referencing the artifact, updating it after a build and triggering a new
plan, the whole process is automated and visible to the entire
organization.

### Getting Started

There are a number of places to start building out a pipeline similar to
this. Because of Packer and Terraform are agnostic to specific tools or
technologies, you can begin implementing with existing configuration
management, cloud providers or containers.

We recommend following the guide for [Creating AMI Artifacts with Atlas](https://atlas.hashicorp.com/help/packer/artifacts/creating-amis)
in the Atlas help, or reading [about Atlas](https://atlas.hashicorp.com/help).

In future posts, we will continue detailing aspects of this pipeline,
including notifications to Slack, Email, and HipChat at each stage of
builds and deployment.

_Note: There is currently a beta feature that further automates this
pipeline. This feature removes the plan confirmation step and automatically deploys
instances using the newly created images without the need for explicit
operator confirmation. This is experimental, and detailed
[here](https://atlas.hashicorp.com/help/terraform/runs/automatic-applies)._

