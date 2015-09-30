---
page_title: "Consul in Atlas: Alerts and Monitoring"
title: "Consul in Atlas: Alerts and Monitoring"
list_image_url: /images/blog/atlas/atlas-logo.png
post_image_url: /images/blog/atlas-consul/alert-show-ui.png
tags: atlas, consul
author: Jack Pearkes
---

Today we are proud to announce another feature powered by Consul and Atlas — infrastructure alerts. Operators can receive alerts in Slack, email, PagerDuty, and custom webhooks when there is a status change in a node or service in their infrastructure. Atlas also provides a complete history of alerts, so the state of a cluster through time can be easily visualized.

[Consul](https://consul.io) is a solution for service discovery, health checks, and runtime orchestration for the modern datacenter. It is distributed, highly available, and scalable to thousands of nodes and services across multiple datacenters. Consul's health checks are configurable at both the service and node level. A health check can be as simple as measuring disk utility or as complex as a custom service-level test. Since health checks can use Nagios plugins or native HTTP checks, they are easy to integrate into an existing infrastructure.

Read on to learn more about Consul alerts and see screenshots of the features in action.

READMORE

## Alert Channel Integrations

Alerts can be sent to Slack, email, and PagerDuty when a Consul health check enters a warning or critical state, or if a new node joins the cluster.

The alert integration options enable organizations to close the feedback loop between infrastructure monitoring and the operators that support the infrastructure. In this example alerts are sent to Slack when a new node joins the cluster or when a service experiences a warning level health check:

![Slack Alerts](/images/blog/atlas-consul/slack.png)

## Alert History in Atlas

The mission of Atlas is to provide operators a system of version control for infrastructure. All infrastructure changes are versioned, auditable, and collaborative. Staying true to this goal, Atlas keeps a history of all alerts. Operators can use this history to understand the current status of the managed infrastructure and the relevant history of alerts that brought it to the current state.

![Alert Index UI](/images/blog/atlas-consul/alert-index-ui.png)

This view displays the entire history of alerts for the infrastructure
and drill-down information on specific alerts and their corresponding health checks. It shows
the health check name, current status, and node the alert occurred on.

![Single Alert UI](/images/blog/atlas-consul/alert-show-ui.png)

## Getting Started

If your infrastructure is already using Consul and Atlas to monitor node and service health, you can immediately activate alerts in the "Integrations" tab of the environment in your Atlas account.

![Alert settings](/images/blog/atlas-consul/alert-settings.png)

If you haven't connected Consul to Atlas yet, follow the [integration guide](https://consul.io/docs/guides/atlas.html) in the Consul documentation. Note that using Consul alerts does not require using all features of Atlas.

If you aren't using Consul for service discovery, health checks, and runtime orchestration, you can [learn more about Consul](https://consul.io) and [configuring Consul health checks](https://consul.io/docs/agent/checks.html).

## The Future

The announcement today follows recent Atlas improvements to enable operators to responsibly deploy applications and make changes to infrastructure. Real-time alerting is a key feature for infrastructure management, and we're excited to bring this functionality to Atlas.

As we extend support for notifications in Atlas, both Packer builds and Terraform runs will be able to trigger notifications upon completion and/or failure.

Atlas is our commercial product currently in tech preview. We will be announcing pricing soon. When Atlas pricing is announced, there will be a generous free tier, so you don't need to worry about being charged for playing with Atlas. If you're using Atlas at a larger scale and have concerns, email us at <a href="mailto:hello@hashicorp.com">hello@hashicorp.com</a> and we'd be happy to talk with you.
