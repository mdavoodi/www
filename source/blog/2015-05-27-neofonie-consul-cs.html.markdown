---
page_title: "Consul in a Microservices Environment at Neofonie GmbH"
title: "Consul in a Microservices Environment at Neofonie GmbH"
list_image_url: "/images/blog/consul/logo-gradient.png"
tags: case-study
author: Kevin Fishner
---

Neofonie GmbH is a German software company with offices in Berlin and Hamburg. The firm is a solution and full-service provider specializing on portals, search, social media, e-publishing and mobile applications. With a range of clients and services, Neofonie works in highly complex, fast-changing environments. Neofonie uses a three-stage continuous delivery pipeline which uses Consul as a foundation to safely move applications between environments.

READMORE

_You can find an excerpt of the German version of this post on [Neofonie's blog](http://blog.neofonie.de/2015/05/26/microservices-wie-docker-und-consul-entwicklunsprozesse-revolutionieren)_.

## The problem: promoting software across environments is error-prone

Responsible software release cycles usually require promoting software across testing, staging, and production environments. This process, while enabling safety, can be error prone and difficult. For example, you can start multiple services in a local environment, but the IPs must be changed so services can properly discover each other in this environment. Then when the software is deployed to a different environment, the IPs need to change again. Doing this for dozens of interconnected services, becomes unmanageable and error-prone. 

One of the biggest projects at Neofonie uses a three-stage continuous delivery pipeline. Previously to move an application between stages, each stage had its own property file with appropriate IPs for that specific stage. For example, the development stage required you to connect to a MySQL instance on your localhost, which needed to be manually configured.

However in staging and production, the application has to connect to a remote MySQL instance. There have been times where the wrong IPs were committed and the staging environment tried to connect to MySQL on localhost. Or even worse, the development environment tried to connect to production MySQL instances. Of course, mistakes cannot be completely avoided, but we needed to take steps to reduce the risks inherent involved in continuous delivery pipelines.

The applications are packaged as Docker containers, which isolates them from other services and the underlying OS. However, Docker doesn’t solve the problem of discovering dependent services. Dependent IPs can be injected into the Docker container on initialization, but what happens if a service goes down or is restarted? There would be no way to inform other services of the new location. The dynamic nature of containers requires a new approach. Neofonie wanted to just start containers and have all dependencies managed without manual intervention to update IPs. Consul is now used to achieve this.

## Containerized services with Consul as a service registry

Using Consul as a DNS server in combination with the Consul Service Registry means that a set of Docker-images can start anywhere without changing properties. The Consul registry confines the boundaries of a service-topology per se. The service-topology becomes decoupled from the underlying machines. Be it development, test or production, the way services are queried always remains the same. The service  environment is governed by a specific Consul-instance which has proved to be a very elegant solution.

The Service Registry keeps track of all available services in a specific environment. The Consul registry is packaged in a container as well, making it easy to bring up in any environment. The other containers in the environment each hold a Consul agent and are made aware of the Consul registry when they are started. This is accomplished by using the link-mechanism that Docker provides to share environment variables between containers.

![Docker Host VM](/images/blog/neofonie-case-study/docker-host-vm.png)

Now, by querying the Consul API, services can easily find each other. On some parts of the system however, Neofonie is not in control of service resolution so a different approach is needed. For example, suppose you want to connect to a certain service using JDBC or a similar technique. It is not possible to provide an IP on the fly and/or appropriate failover information. Consul could help here too as it can  act as a fully functional DNS server. Neofonie configured its containers so that Consul acts as the primary DNS service. It enables a simple dig in a container to get the IP of a desired service. Consul resolves the IPs in a round-robin fashion. When a service scales up, it will deliver more IPs and vice versa.

![Giantswarm Cluster](/images/blog/neofonie-case-study/giantswarm-cluster.png)

Earlier it was mentioned that the Consul registry confines the boundaries of a service-topology per se. This requires a little more explanation and is shown graphically in Figure 2 above. Often the stages in a continuous delivery pipeline are bounded by the virtual machines in each stage. Testing has a set of machines used for testing and staging has a separate set. The advantage here is that environments are separated from each other on the VM level. But there is also a downside; the virtual machines sit idle for most of the time.

By using Consul to define the boundaries of the service-topology, it is possible to express encapsulation on the service discovery level. Each node in the CoreOS cluster (provided by Giant Swarm) runs a Consul Registry which form a quorum. Services can then be deployed anywhere in the cluster and they will, via Consul, understand which ‘stage’ they are in. This in effect achieves pipeline ‘stages’ that are agnostic of the underlying virtual machines.

Apart from the Service Registry and the DNS functionality, Consul offers even more neat and interesting features. For example, besides being a key-value store, it also does health and heartbeat checks.

The Neofonie service-topology relies on heartbeat checks to identify if a service is healthy or not. If the service fails to send a heartbeat, it is automatically marked as failed in the Consul cluster. Consul then removes the IP from the list of healthy services, which removes the IP from any configurations using the Consul API. For example, the load-balancer in the Neofonie infrastructure will immediately be updated and no longer use the failing IP.

## Summary

By using Consul, Neofonie simplified its development and deployment process significantly. A developer can now simply check out his or her project and then spawn a part of the production environment on a local machine using Docker Compose. Consul confines the service topology which means that there is no longer any difference between the testing and production stages. This approach reduces mistakes and increases efficiency.

As mentioned above, Neofonie uses Giant Swarm's microservice infrastructure for Docker container clusters, which manages the underlying infrastructure.
