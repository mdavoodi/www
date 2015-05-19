---
page_title: "Consul in Atlas: Alerts and Monitoring"
title: "Consul in Atlas: Alerts and Monitoring"
list_image_url: /images/blog/atlas/atlas-logo.png
post_image_url: /images/blog/atlas-consul/alert-show-ui.png
tags: atlas, consul
author: Jack Pearkes
---

Today we announce [Consul](https://consul.io) integration
with [Atlas](https://atlas.hashicorp.com/?utm_source=Consul-Atlas). Atlas harnesses
the system-level and application-level health checks monitored by Consul
to automatically show a monitoring UI and alert system. Alerts can
be sent to Slack, email and Pagerduty.

Consul is a solution for service discovery, configuration, and orchestration.
Consul is completely distributed, highly available, and scales to thousands of
nodes and services across multiple datacenters.

Read on to learn more and see screenshots of this in action.

READMORE

## Alert Integrations

When a health check in Consul becomes warning, critical or a new node
joins, alerts can automatically be sent to Slack, email and pagerduty.

This allows you further insight into cluster health and to highlight important
changes to your infrastructure. Integrating into chat and email broadcasts
the alert to members of your organization.

In this example, alerts were sent to Slack when a new node joined
and a service experienced a warning level health check for it's HTTP server:

![Slack Alerts](/images/blog/atlas-consul/slack.png)

Alerts are sent to notification channels based on thresholds you
set. Node joins, graceful leaves and check recoveries are all handled
to help remove noise and add clarity to diagnosis.

## Alert UI

Atlas also provides a UI for alert history and in-depth check information alongside
real-time infastructure status and changes made via Terraform.

![Alert Index UI](/images/blog/atlas-consul/alert-index-ui.png)

From this view you can see the entire history of alerts for your infrastructure
and drill down to specific alerts to view health check information. It shows
the health check name, status and node the alert it occurred on. Service
checks show the service in question.

When viewing a single alert, any health check output is shown, as well
as further details about the alert. The UI also pulls the latest
health information about the node or service and shows the real-time
status to aid in debugging.

![Single Alert UI](/images/blog/atlas-consul/alert-show-ui.png)


## Consul and Health Checks

Atlas alerts based on health check status recorded by [Consul](https://consul.io). To
start using Consul alerts, you'll need to [connect Consul to Atlas](https://consul.io/docs/guides/atlas.html).

Consul health checks can be configured to run against a node
or Consul service. This provides node health checks like disk space,
load average and others, as well as application-level such as HTTP checks.

Many infrastructures already using Consul to monitor the health of their
application can immediately activate alerting by using Atlas.

## Getting Started

You can get started with Atlas and Consul right now. If you already
have Consul connected to Atlas, head over the integrations tab and
modify your alert settings:

![Alert settings](/images/blog/atlas-consul/alert-settings.png)

If you haven't connected Consul yet, follow the [Atlas integration guide](https://consul.io/docs/guides/atlas.html)
on the Consul website now.

## The Future

What we've released today follows recent improvements to Atlas
to enable infrastructure collaboration and responsible deployment
using components of the HashiCorp toolset.

As always, the Consul Alerts integration can be used in isolation
without Terraform, Packer or other aspects of Atlas.

Soon, Packer build and Terraform changes will trigger alert notifications
upon completion and failure to continue providing insight into the build
pipeline for your infrastructure.

But with what we've launched today, we're excited to provide drop-in
alerting for your infrastructure managed by Consul.

Atlas is our commercial product currently in tech preview. We will be
announcing pricing soon. When Atlas pricing is announced, there will be
a generous free tier, so you don't need to worry about being charged for
playing with Atlas. If you're using Atlas at a larger scale and have concerns,
email us at
<a href="mailto:hello@hashicorp.com">hello@hashicorp.com</a> and we'd
be happy to talk with you.
