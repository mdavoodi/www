---
page_title: "Packer & Terraform Notifications in Atlas"
title: "Packer & Terraform Notifications in Atlas"
list_image_url: /images/blog/atlas/atlas-logo.png
post_image_url: /images/blog/atlas-build-run-notifications/notifications-ops.png
tags: atlas, packer, terraform
author: Justin Campbell
---

We are pleased to announce the availability of Packer Build and Terraform Run notifications in Atlas. Notifications build on top of our [Consul Alerts infrastructure](https://atlas.hashicorp.com/help/consul/alerts), providing real-time notification of important events in Atlas, such as a Packer build finishing, or a Terraform plan needing confirmation before an apply.

We have also added the ability to customize notification methods for individual build configurations or environments.

Continue reading to learn more about how Packer and Terraform integrate with Atlas, and to see more screenshots of Atlas notifications.

READMORE

## Packer Build Notifications

Atlas can start Packer builds via a `packer push`, from a change on a configured GitHub repository, or when a [linked application](https://atlas.hashicorp.com/help/packer/builds/linked-applications) is updated.

Notifications can be sent when a build starts, finishes, errors, or is canceled, and each of these is configurable for a build configuration. Learn more about using Packer in Atlas.

![Screenshot of Packer build notification settings in Atlas](/images/blog/atlas-build-run-notifications/build-notification-settings.png)

## Terraform Run Notifications

Atlas can plan and apply your Terraform configuration, enabling automatic and safe changes to your infrastructure. Learn more about using Terraform in Atlas.

Notifications can be sent when a plan fails, needs confirmation, or is discarded, or when an apply starts, finishes, or encounters an error.

![Screenshot of Terraform run notification settings in Atlas](/images/blog/atlas-build-run-notifications/run-notification-settings.png)

## Email Logs

In addition to simple notifications, emails will also include logs for relevant build and run events. Logs will be truncated to the last 100 lines.

![Screenshot of Atlas email notifications with logs](/images/blog/atlas-build-run-notifications/email-notification-with-log.png)

## Notification Methods

We [currently support](https://atlas.hashicorp.com/help/consul/alerts/notification-methods) notifications sent to Email, HipChat, Slack, and custom Webhooks. Additionally, we support PagerDuty integration for Consul Alerts. You can read more about supported notification methods in Atlas in our [help documentation](https://atlas.hashicorp.com/help/consul/alerts/notification-methods).

Notification methods can be configured for your organization by visiting the Configuration section in the sidebar.

![Screenshot of configuring notification methods on an organization in Atlas](/images/blog/atlas-build-run-notifications/org-notification-methods.png)

Additionally, it is now possible to customize notification methods on an individual build configuration or environment. For instance, maybe you want most infrastructure notifications to go to an `#ops` chat room, but would prefer your development team receives notifications for their application’s Packer builds in their own room.

![Screenshot of overriding notification methods on a build configuration in Atlas](/images/blog/atlas-build-run-notifications/notification-methods-override.png)

When you override notification methods, your organization’s notification methods are copied to make customizing them easier.

## Getting Started

If you are already using Atlas to build Packer images or to manage your infrastructure with Terraform, you can enable notifications by visiting the settings page for a build configuration or environment.

If you do not currently use Atlas with Packer or Terraform, you can get started with one of our [Atlas tutorials](https://atlas.hashicorp.com/help/intro/getting-started) today.

## About Atlas

Atlas is our commercial product, integrating all of our open-source tools into an infrastructure collaboration platform for your team. Atlas builds upon and unites HashiCorp's open source tooling to _automate and audit infrastructure changes across providers_. Vagrant, Packer, Terraform, Consul, and Vault are connected to create and establish a workflow that enables organizations to not only manage infrastructure, but audit and collaborate on those changes in a central location. This post will focus on using Atlas to connect Packer and Terraform to create an automated pipeline for building and deploying artifacts and immutable infrastructure.

