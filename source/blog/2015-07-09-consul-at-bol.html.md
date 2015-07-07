---
page_title: "Using Consul at Bol.com, the Largest Online Retailer in the Netherlands and Belgium"
title: "Using Consul at Bol.com, the Largest Online Retailer in the Netherlands and Belgium"
list_image_url: "/images/blog/consul/logo-gradient.png"
tags: case-study
author: Kevin Fishner
---

Bol.com is the largest online retailer in the Netherlands and Belgium offering, as of May, a catalog of 9.3 million products to its 5.4 million customers. Powering the online shopping experience is a collection of more than 130 different applications and services that all need to work together. The bol.com team is constantly looking for ways to improve; a mission which has taken us from a collection of several software monoliths to a service-oriented architecture. Recently, we decided to start using [HashiCorp’s Consul](https://consul.io) for dynamic service discovery.

In our previous setup a configuration update would take 15 to 20 minutes before the changes propagated across the system. Using Consul, these are now made in near real-time which enables us to develop more resilient software systems, faster.

READMORE

_This post was originally published by bol.com on [their official blog](https://banen.bol.com/nieuws/using-consul-bol-com/). We're republishing it on the HashiCorp blog so future readers can easily find posts about the usage of our tools in real-world environments._

## The Problem - Static service discovery just can’t cut it at scale
Last year we built and went online with an infrastructure management system whereby all services had logical names in each environment and developers configured their services to talk to each other. The entire system was, however, completely static. Everything was derived from a single source of truth (a CMDB) which engineers had to edit by hand. Editing was very easy and Puppet-based automation took care of the rest, but the fact that it was not dynamic turned out to be a bottleneck as our software landscape grew.

Want to add another instance of service X to the load balancer? Fire up the CMDB app. Want to change the hostname for a particular service? Well, that means re-provisioning a bunch of VM's from scratch and changing all the properties that reference the old hostname across the testing, acceptance, staging and production environments.

Static service registration served its purpose, but bol.com needed a dynamic solution.

It just wasn’t dynamic enough. What we really wanted was for services to be able to find each other on the fly, irrespective of what hosts the services were running on. In short, we needed service discovery.

Provided that your services support it, not having to know exactly what host a service is running on means that you can scale and move instances in case of failure. Achieving this portability with VM’s is feasible (as Netflix proved on AWS using tools like Aminator) but we chose to go with a container-based solution.

The recent rise of Docker has made us question if we really need a full VM to isolate workloads. Having containers running single processes as our unit of deployment, instead of a VM with an entire OS stack (and all the necessary tooling) was very appealing. It makes our deployment process more lightweight, allows developers to easily run production versions of apps on their laptop, decreases deployment time and can significantly boost the utilization of production servers. In addition, the layered Docker image format and registry provide a very efficient and easy distribution mechanism for container images.

## Consul is necessary to orchestrate Docker containers at scale
Containers alone however don’t provide all of the aforementioned benefits. We needed some kind of orchestration software to decide which containers would be run where and when. As the basis for our new platform we initially looked at using Kubernetes or Fleet but eventually chose to go with Marathon running on top of Mesos. We liked Mesos because it is a battle hardened, proven cluster manager that really delivers on its promise of essentially turning your data center into one big computer. We chose Marathon as a task runner on top Mesos because it has a solid API that our internal tools can talk to.

Now that our services could be run on our cluster we needed service discovery. We first considered rolling our own on top of etcd or Zookeeper before discovering that Consul is easy to get running, provides a simple REST API that speaks human-readable JSON, supports ACLs, and, as a pleasant extra, it actually has a nice GUI.

Furthermore, the DNS-based discovery feature seemed like a nice way to let legacy applications integrate with the new system. Consul’s distributed key-value store and health checking were also features that we envisioned using. Finally, Consul seemed to be gaining wide adoption and has the support of a rapidly growing community. We were confident that this wasn’t a tool that would turn into abandonware anytime soon.

## How is Consul actually being used at bol.com?
We are currently using Consul for service discovery within Mayfly, our user-story based development platform. Because the platform is under heavy development and has an explicit mandate to use emerging technologies, Mayfly was the ideal place within our organization to try out something like Consul. The 6 services that constitute Mayfly were the first to be "Consul-enabled". Currently we're only using two of Consul’s features; service discovery and simple health checks.

We've built an extension to Backspin, our in-house web services framework, that lets services register themselves with Consul and then find each other in a completely dynamic way.


bol.com services use the in-house Backspin service framework to communicate. We built a Consul adapter for Backspin that allows a service to register itself with the service registry, discover other services and pull values from the KV store. The adapter also polls Consul periodically to check if any service instances it has discovered are still up and, if they’re not, reinitializing the connection pool with other instances.

The only thing required to discover a service is its immutable three-letter identifier (which we assign to a service when it’s conceived) and the required version. The current implementation is simple and has allowed us to discard countless lines of configuration. Now that Consul has proven itself on the Mayfly platform, we are investigating how to roll it out across the entire bol.com service landscape. One of the challenges we face is how to expose the old-style, Puppet-configured services to the Consul-enabled ones. We'll need to setup a bidirectional information flow between these two separate configuration realms. We could, for instance, use the Consul-Hiera Puppet module to make Hiera values are available to Consul-enabled services, and a tool like Consul Template can be used to provide regular config files to services that don’t yet know how to talk to service discovery. A setup such as this allows us to progressively move services to Consul and avoid the need for any kind of big-bang migration.

## Outstanding Challenges
There are two main issues we ran into in our adoption of Consul. The first, and most annoying, is that the API can at times be a little flaky and inconsistent.

There still seem to be several issues in the API that need to be ironed out. We realize Consul is only at 0.5.2 at the moment, but it’s still annoying to have to work around them. For instance, some different calls can give you the same logical object in different ways. If you call `{host}/v1/health/service/{service}` it will return:

<pre class="prettyprint">
"Node":
{
    "Node": "",
    "Address": ""
},
"Service":
{
    "ID": "",
    "Service": "",
    "Port": 31015
},
</pre>

while the service catalogue returns the following for the same object:

<pre class="prettyprint">
{
    "Node": "",
    "Address": "",
    "ServiceID": "",
    "ServiceName": "",
    "ServicePort": 
}
</pre>

Not only are there two different structures for representing the same object, some of the property names are different as well. Besides these kinds of issues there are also small inconveniences like not being able to query the catalog for all services that have passing health checks.

The second problem was with the key-value store. While it works fine as a KV store it is missing some features that we require, which prompted us to write our own KV store (that will be open sourced when we get the time) for internal use. At bol.com services have property sets that are versioned. We wanted a system whereby each property key could have different values for different version, and different versions could contain different keys. What we needed can best be described as a kind of union file system for KV sets whereby, for instance, version 3 of a particular keyset might contain the value for key1 from version 1 and the value from key2 from version 2. There was no good way to shoehorn this model into a flat KV store like the one Consul provides, so we decided to roll our own. I brought this up with Mitchell Hashimoto at a meetup in Amsterdam and he agreed that there was no good way to model this in the Consul KV store at the moment (though it was something that he wanted to support).

In terms of other features that we’d like to see, we’d like to be able to add custom information to service discovery records. If a connection to a particular web service needs, for instance, a proxy then there’s no way to define that in the service discovery record. Of course you can store that information in the KV store and look it up separately, but that not only means another request to Consul but also forces you to do maintenance on the stale KV entries as services disappear. It would be easier to just have Consul take care of this for you and give you the proxy information (or DB connection password information or service API version number, etc. etc.) in the service discovery response.

We’d also like to have an “environment” abstraction in Consul, along with the DC abstraction. This would allow us to logically separate our Mayfly user story environments from each other without having to either run a separate Consul instance for each environment or namespace not only the service names but also the entire KV store.

## Summary
The dynamic service orchestration that we now use with the Mayfly project would have been impossible without Consul. In our previous setup an update to the CMDB would start Puppet and we would have to wait between 15 and 20 minutes before the changes were in place. These changes can now be made in near real-time which enables us to develop more resilient software systems, faster.

The next step is to see if we can roll this approach out to the Dockerized services that are currently running in production and integrate these with the legacy components in the system. To do this we’re considering using a Hiera-Consul bridge which will allow the Consul-enabled services to speak to the rest and vica-versa. Furthermore, we could use the Consul-template to skip the Puppet runs by automatically generating config files for these legacy services allowing us to skip the entire Puppet manifest loading stage.

The last step will be to Docker-ize all services using the approach from the Mayfly project. A process which, when complete, will mean that all our services will be Consul-enabled and Puppet can be taken out of the loop completely. We’re also looking at HashiCorp’s Vault right now. More news on that soon.
