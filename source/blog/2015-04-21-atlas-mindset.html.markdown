---
page_title: "The Atlas Mindset: Version Control for Infrastructure"
title: "The Atlas Mindset: Version Control for Infrastructure"
list_image_url: /images/blog/atlas/atlas-logo.png
tags: atlas
author: Kevin Fishner
---

HashiCorp is the creator of the open source projects [Packer](https://packer.io/?utm_source=blog&utm_campaign=AtlasMindset), [Vagrant](https://www.vagrantup.com/?utm_source=blog&utm_campaign=AtlasMindset), [Terraform](https://terraform.io/?utm_source=blog&utm_campaign=AtlasMindset), [Serf](https://serfdom.io/?utm_source=blog&utm_campaign=AtlasMindset), and [Consul](https://consul.io/?utm_source=blog&utm_campaign=AtlasMindset), as well as the commercial product [Atlas](https://atlas.hashicorp.com/?utm_source=blog&utm_campaign=AtlasMindset). At HashiCorp, we are committed to building tools that provide visibility into operator workflows and allow for responsible changes to infrastructure. Our product development is driven by the qualities of the modern datacenter and qualities of responsible infrastructure management. This post explains our process.

READMORE

![Atlas Mindset](/images/blog/atlas-mindset/atlas-mindset.png)

## Qualities of the Modern Datacenter
The modern datacenter has several qualities that differentiate it from predecessors. The modern datacenter is elastic with on-demand resources, designed for massive scale, and diverse with internal technologies.  Physical machines, virtual machines, containers, new programming languages, testing tools, and larger code repositories all add complexity to the datacenter each year. But regardless of the technology choices, your organization's goal is always the same — to safely turn application code into a running application in production.

## Qualities of Responsible Infrastructure Management in the Modern Datacenter
Infrastructure management done responsibly is a versioned, auditable, repeatable, and collaborative process. As a reference point, application development became a versioned, auditable, repeatable, and collaborative process with the widespread adoption of version control systems such as Git and Subversion. A good application developer would never start a project without a version control system to track changes and audit the process. Similarly, operators should use a system that enables versioning, auditing, and collaborating on infrastructure changes. Infrastructure development is equally as complex as application development, yet collaboration is difficult due to insufficient tooling. Atlas brings the benefits of version control to infrastructure by holding several beliefs:

* Configuration, such as installing packages or creating users, should be done in the build phase, not at runtime. This gives rise to immutable infrastructure, the notion that changes should never be made to a live production server. Instead, create a new server with the proper configuration, and tear down the old server. This reduces the risk of an unhealthy server receiving production traffic due to a runtime configuration failure, and creates a linear history of changes.
* Service and infrastructure configurations should be represented as code. This allows the configurations to be versioned, audited, and shared with your team.
* Static configuration should never be used to represent dynamic values. There should never be hard-coded IP addresses or stale values in a service configuration. Instead systems should leverage service discovery for dynamic values. The rapid rate of change in the modern datacenter, combined with build-time configuration, necessitate dynamic configurations using service discovery.

## HashiCorp Product Development
The above beliefs about responsible infrastructure management lay the foundation for our product development:

* Packer enables simple, repeatable, and automated build-time configuration
* Packer and Terraform enable service and infrastructure configuration to be represented as code and shared with teams for collaboration.
* Consul enables dynamic service discovery and the removal of easily stale values from service configurations.

Atlas’s workflow for turning code into a running application is shown below. The workflow builds on HashiCorp's open source tools as the foundation for responsible infrastructure management.

![Atlas Mindset](/images/blog/atlas-mindset/atlas-workflow.png)

Each open source project is designed to solve a specific problem in application delivery, and each is purposefully unaware of the other steps. While the individual open source projects are narrow in scope, Atlas unifies them to provide a repeatable, versioned, auditable, and collaborative workflow for turning code into a running application. We are focused on providing an elegant, responsible workflow for managing infrastructure so organizations can focus on building innovative technology, not deploying it. [Manage infrastructure responsibly with Atlas today](https://atlas.hashicorp.com/?utm_source=blog&utm_campaign=AtlasMindset1).
