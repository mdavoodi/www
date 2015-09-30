---
page_title: "Atlas General Availability"
title: "Atlas General Availability"
list_image_url: /images/blog/atlas/atlas-logo.png
post_image_url: /images/blog/atlas/how-it-works.png
author: Mitchell Hashimoto
tags: atlas
---

We are excited to announce that [Atlas](https://atlas.hashicorp.com) is now generally available. Atlas builds upon and unites our popular open source tooling to create a version control system for infrastructure. Automate, audit, and collaborate on infrastructure changes across any infrastructure provider.

We have had seven incredibly productive months since Atlas's launch in December 2014. Over these months and with an amazing effort from our team, the product has become a polished, intuitive experience. Nodes under management have doubled each month Atlas has been live. We have partners that provide excellent feedback: Mozilla, Cisco, and Capgemini to name a few.

HashiCorp is now entering a new chapter. We have always been and will continue to be firmly committed to improving and supporting our open source projects; they are the foundation of our company and Atlas. Alongside our technological developments and community building, we are committed to building a scalable and customer-friendly business.

READMORE

## Journey from Tech Preview to General Availability

When Atlas launched into tech preview, it could only host Vagrant boxes and run Packer builds that produced AMIs. Today, just seven months later, Atlas deeply integrates all of HashiCorp's open source products: Vagrant, Packer, Terraform, Consul, and Vault. Atlas hosts Vagrant boxes and adds extra features on top of Vagrant. Atlas can run Packer builds resulting in any output format: VMware, AWS, Docker, VirtualBox, and more. Atlas plans and builds infrastructure with Terraform. Atlas monitors and configures launched hosts and services with Consul.

These features come together to form a Version Control System for Infrastructure.

It is hard to imagine starting a new development project without a version control system such as Git (with GitHub). But that application is often deployed to unversioned, opaque, and fragile infrastructure. With Atlas we want to provide developers and operators an elegant, productivity-boosting tool and collaboration platform to be able to deploy and maintain applications. Once a team starts using Atlas, it's tough to imagine a future without a version control system for infrastructure.

Read on to learn more about the specific features we've brought to Atlas as they relate to our open source projects, and how they unite to form Atlas.

## Packer features in Atlas

Packer is used by tens of thousands of companies worldwide to build artifacts for deployment and development. Atlas features around Packer solve common needs that arise within organizations using Packer.

![Packer in Atlas screenshot](/images/blog/atlas/packer-screenshot.png)

  * **Atlas runs Packer for you** - Instead of running potentially long builds on development machines, Atlas runs Packer for you. This not only frees up local resources, but also lets Packer build for platforms that are sometimes difficult from a local machine: QEMU, VMware, etc.
  * **Artifact storage and versioning** - Atlas stores and versions the artifact outputs of Packer builds (AMIs, VMware images, Docker containers, etc.) in a single central artifact repository accessible with an API. This makes it simple to build orchestration around getting the latest or a specific version of artifacts for deployment (often with Terraform).
  * **Build logs and history** - Atlas keeps a history of all the Packer builds that have been run, who initiated the build, the result of the build, and the log from Packer. This build history is namespaced by application or artifact, so it is easy to see and iterate on Packer builds.

To learn more about Packer features and instructions for using them, [read the documentation](https://atlas.hashicorp.com/help/packer/features).

## Terraform features in Atlas

Terraform is our command-line tool for automating infrastructure provisioning. Atlas builds on top of Terraform to make using it in a team setting a safer process, and brings collaboration to infrastructure deployment.

![Terraform in Atlas screenshot](/images/blog/atlas/terraform-screenshot.png)

  * **Terraform state storage** - Atlas stores Terraform state and ensures are all operations work from the same state. This ensures that the state isn't modified in parallel and that Terraform always has a consistent view of your infrastructure.
  * **Terraform plan and apply** - Atlas runs Terraform to generate a plan of what changes will happen to your infrastructure. If the plan is approved, Atlas will run Terraform and apply those changes. The logs of all of this are stored and are viewable in Atlas.
  * **Infrastructure changelog** - The complete history of Terraform plans and applies (both successes and failures) are stored and viewable. This is very similar to the "commit view" for Git; you can see the changes to your infrastructure over time, who proposed the change, who accepted the change, and what the result of that change was.
  * **Link GitHub and Terraform** - Terraform encourages infrastructure as code: define your infrastructure in versionable text files. GitHub is the best place to store and version the text files themselves. You can link GitHub to Atlas and Atlas will automatically run Terraform plans as part of pull reviews. This lets you see the effect of a code change on your infrastructure!

To learn more about Terraform features and instructions for using them, [read the documentation](https://atlas.hashicorp.com/help/terraform/features).

## Consul features in Atlas

Consul is our tool for service discovery, configuration, and monitoring. Atlas integrates with Consul to provide features that help with bootstrapping Consul, visualizing cluster state, and alerting based on Consul cluster changes.

![Consul in Atlas screenshot](/images/blog/atlas/consul-screenshot.png)

  * **Dashboard view of services and nodes health** - Atlas shows the health of all the nodes and services of a Consul cluster in a single interface. This makes it easy to visualize the state of your infrastructure in real-time.
  * **Auto-join peers in a Consul cluster** - With a single flag, Consul agents will automatically discover and join your cluster. This eliminates the need for manual bootstrapping, and makes bootstrapping as simple as specifying a flag to Consul.
  * **Alerts to Slack, PagerDuty, email, and more** - Atlas will alert on changes in your Consul cluster: monitoring events, cluster health, and more.
  * **Cluster change history** - Atlas shows a log of changes in your infrastructure from the viewpoint of Consul: nodes joining, services becoming healthy/unhealthy, etc. Paired with the Terraform log, this gives you an additional view of the changes in your infrastructure over time.

To learn more about Consul features and instructions for using them, [read the documentation](https://atlas.hashicorp.com/help/consul/features).

## General Availability Details

The biggest change with Atlas general availability is that it is no longer a free product. The first ten managed nodes are free, and each additional [managed node](https://atlas.hashicorp.com/help/glossary#managed-node) is $40 per month. Vagrant and Packer features - including Vagrant share, private boxes, and unlimited builders - are completely free. We may restrict certain Packer builds to paying customers in the future (long running builds, parallelism, etc.) If this uncertainty concerns you, please email <a href="mailto:support@hashicorp.com">support@hashicorp.com</a> and we'll discuss plans with you. Basic email support is included for all customers.

If your account is in the paid tier, you will be contacted before the first billing cycle in August. If your team has any questions about general availability or requires priority support, SLAs, or an on-premises installation, please contact us at <a href="mailto:support@hashicorp.com">support@hashicorp.com</a>.

## Atlas Roadmap

In the past seven months we've shipped all the above features while delivering more industry-leading open source projects. In the coming months Atlas will continue to gain tremendous improvements. Below are some exciting features on the roadmap:

  * **GitHub integration across all features** - As with Terraform, Packer and Consul (key/value) configurations on GitHub can be configured to automatically trigger infrastructure updates in Atlas when changed.
  * **Remove redundancy between configurations** - Across Packer, Terraform, and Consul there is a fair amount of redundancy. We have plans to simplify configurations when all tools are in use together.
  * **Vault integration** - Atlas will integrate and add features above Vault similar to our other tools.
