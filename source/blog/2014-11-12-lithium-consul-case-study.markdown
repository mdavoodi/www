---
page_title: "How Lithium Technologies Uses Consul in a Hybrid-Cloud Infrastructure"
title: "How Lithium Technologies Uses Consul in a Hybrid-Cloud Infrastructure"
list_image_url: /images/blog/lithium-consul-case-study/Lithium-and-Consul.jpg
post_image_url: /images/blog/lithium-consul-case-study/lithium-consul-horizontal.png
author: Kevin Fishner
tags: consul, case-study
---
Lithium Technologies provides a complete social platform to some of the world's most well-known brands across tech, consumer electronics, financial services, retail, and other industries. These brands rely on the Lithium Social Platform to power customer communities, respond to social media conversations, and drive social analytics. The Lithium infrastructure manages complex real-time data ingestion and processing. To meet the needs of customers and plan for long-term growth, Lithium decided to build out a hybrid-cloud infrastructure. Consul enables automated service discovery and load balancing in Lithium's hybrid-cloud environment, saving hundreds of thousands of dollars and significant development time.

READMORE

## The challenges of service discovery and load balancing in a hybrid-cloud environment
Lithium operates a hybrid-cloud infrastructure consisting of private clouds in private datacenters and public cloud providers. Inbound requests are load balanced across the cloud environments. For Lithium the major challenges of scaling a hybrid-cloud infrastructure were:

- **Automated service discovery in a dynamic environment** - As nodes came up and down across the Lithium infrastructure, internally managing DNS became infeasible.

- **Load balancing and health monitoring across cloud environments** - HAProxy load balancing relies on an up-to-date registry of healthy nodes. Without a cross-cloud perspective tied with health monitoring, data could be lost if routed to an unhealthy node.

![Lithium Before and After](/images/blog/lithium-consul-case-study/Lithium-Before-After.jpg)

## Consul enables automated service discovery and hybrid-cloud load balancing
There are existing solutions for Lithium's challenges, but they rely on stitching together disparate services that are prone to drifting away from each other. It requires customization per service and per infrastructure provider. The complexity around integrating many services into many infrastructures quickly multiplies to become an unmanageable project. Lithium required a solution that could perform across datacenters and clouds (public and private) without extensive custom tooling. Justin Franks, Lead Operations Engineer explains what Lithium was looking for:

> We run lean, smart, and nimble. We take advantage of whatever we can find that will help us reduce potential errors and failure points and be efficient. Consul fit our use case very well.

- **Service discovery, service registry, and health monitoring** - A Consul agent runs on each node and communicates with one or more Consul servers per cloud environment. The Consul agent reports to the Consul server the service running on the node, the status of the service, and the status of the node itself. The end result is an up-to-date service registry held on the Consul server. When a new node comes up, the registry is automatically queried to discover any healthy service in the infrastructure.

- **Cross-cloud service discovery** - Since Consul is provider-agnostic, it can be configured to run on public clouds like AWS, private clouds running on OpenStack, or physical servers. When a cross-cloud service discovery or configuration request is made, the local Consul servers forward the request to the remote cloud and return the result.

Consul allows Lithium to have an up-to-date view of the health of each node across all clouds. All of the URIs, service registry, and service discovery in coordination with load balancing are automatically and dynamically handled by Consul.

## Scalable management of infrastructure with Consul
The integration process for Consul took the Lithium team one day. Justin Franks describes the process:

> Consul is not complicated to put in place. You can bolt it right on to your existing BIND servers in addition to installing the agent on nodes, which is what we did. Using Chef, It took us less than a day get Consul agents on all the servers and to roll out the Consul server clusters. The research process for Consul took a few months, but ninety-nine percent of the time was spent on vetting Consul and other options like Zookeeper+BIND+HAProxy. Last but not least, it took time to champion and evangelize Consul within our organization. Honestly, that part was easy because our engineers picked up on the problems it was solving right away. But since our infrastructure spans the globe and is quite complex, we had a good amount of homework to allow the implementation to be done in less than a day without issue.

With automated service discovery, DNS, and load balancing in place, Consul has saved hundreds of hours of manual tasks. Additionally by eliminating provider-specific load balancers and instead optimizing load across the entire infrastructure, Lithium was able to remove internal HAProxy and other services which reduced the server fleet by approximately 15%. Most of all, Consul provides peace of mind that new nodes will properly enter the fleet, and that data won't be lost to unhealthy nodes.

![Lithium Costs and Benefits](/images/blog/lithium-consul-case-study/Lithium-Cost-Benefit.jpg)

In the end Consul simplified Lithium code, removed single points of failure, greatly reduced the total number of required servers, and cut out hardcoded configuration files to make scaling Lithium's hybrid-cloud deployment manageable.
