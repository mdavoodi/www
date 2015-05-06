---
page_title: "How BitBrains/ASP4all uses Consul for Continuous Deployment across Development, Testing, Acceptance, and Production"
title: "How BitBrains/ASP4all uses Consul for Continuous Deployment across Development, Testing, Acceptance, and Production"
list_image_url: "/images/blog/consul/logo-gradient.png"
tags: case-study
author: Kevin Fishner
---

BitBrains and ASP4all are Dutch infrastructure companies that provide infrastructure hosting and services to clients ranging from large government departments to small web shops. They are currently in the process of merging into one company. They have seen infrastructure challenges of all shapes and sizes, and have a high level of expertise solving these problems. As part of the merger they have created a new team called DeltaForce. 

This team has created a tool which will allows their customer-facing engineers to programmatically deploy infrastructure for new customers and to update the infrastructure of existing customers through a single, defined interface. This tool uses Consul as the foundation for continuous deployment to these environments. Consul’s DNS, Key-Value store, and GUI have given DeltaForce a simple mechanism for reliably delivering software. 

READMORE

_This post was originally published by ASP4All Bitbrains on [their official blog](https://blog.deltaforce.io/wordpress/how-bitbrainsasp4all-uses-consul/) We're republishing it on the HashiCorp blog so future readers can easily find posts about the usage of our tools in real-world environments._

## Continuous deployment across Development, Testing, Acceptance and Production

The solution engineering team set a goal to fully containerize their applications and build a continuous deployment pipeline to test them. To accomplish this, the following problems needed to be solved:

1. Storing and retrieving environment specific configuration at deploy time
1. Migrating docker image versions through the pipeline from development to production
1. Service discovery and health checking

Initially the team stored environment specific configuration on the docker host machines and used Jenkins and a set of scripts and Linux tools on the host VM’s to do the deployment logic. Service discovery was achieved with bash scripts to talk to DNS, information from the hostfile, and Serf to pass messages between the containers at deploy time.

This worked, but there were problems:

1. Two deployment mechanisms were required: One for updating the docker image versions in each environment and another for updating the tooling and configuration on the host VM’s.
1. The tooling and configuration on the hosts was ‘opaque’: Engineers would have to log-in to the hosts when debugging and would have to investigate multiple tools to find problems. They referred to this buildup on the docker hosts as ‘host pollution’.
1. Stretching Jenkins to the limit: Promoting different versions of many different software components across multiple environments proved impossible without a lot of extra plugins and custom scripting.

## Consul’s key-value store streamlines the maintenance of environment configuration

The team adheres to the 12 Factor App methodology where each piece of the software (in this case a Docker image) is environment agnostic and must learn of, and react to, its environment at deploy time.

The team achieves this by running a Consul instance in each environment and uses Consul’s key-value store to maintain environment specific data. When a component is deployed it queries the local Consul instance for information including endpoint locations, access tokens, and a few additional environment configurations. 

Johan Bakker, Senior Engineer at ASP4all explains:

> “Consul offers an easy to implement and complete set of functionality which integrates nicely in a containerized environment. We use the key/value store in combination with consul-templates which offers a lightweight alternative to other tools like puppet/chef.”

Previously environment configuration was stored on the host VM’s file system. By moving this information into Consul it can be updated easily, via the GUI or the REST interface, and is visible to everybody in the team which helps when debugging.

## Consul offers lightweight service discovery

Since Serf was already being used to pass messages between the docker containers at deploy time, the team chose to use Consul for service discovery. Consul uses Serf’s gossip protocol and also has a key-value store and health check functionality. Slotting Consul into the existing architecture proved relatively painless.

_Service Discovery Before Consul:_
![Service Discovery - Before](/images/blog/delta-force-case-study/Deltaforce_ServiceDiscoveryBefore.png)

_Service Discovery After Consul:_
![Service Discovery - After](/images/blog/delta-force-case-study/Deltaforce_ServiceDiscoveryAfter.png)

A Consul agent lives in each container and when a new container is deployed, it registers itself with the Consul server container.The Consul server keeps an up-to-date registry of healthy services which can be queried via DNS and used for service discovery. Consul’s web dashboard displays all the nodes in the cluster, their health, and the services that are active on the node. The introduction of Consul also allowed the team to reduce ‘host pollution’, or the number of scripts and tools on the host VM’s. This made the system easier to understand and debug. Plus the Consul dashboard allows the team to quickly see the health of a given environment, which makes some debugging possible without even logging in to the host.

## Consul’s key-value store is the perfect solution for promoting software versions through the delivery pipeline

DeltaForce uses a typical Development, Testing, Acceptance, Production (DTAP) pipeline to promote their software to production. After struggling to get Jenkins to promote the versions of their many sub-components through their pipeline they decided to use Consul’s key/value store instead. As you can see in the diagram below, after a developer commits a change to Git, Jenkins triggers a build. The result of the build is two-fold:

1. A Docker image is pushed to the private registry
1. The latest version tag is pushed to the Consul cluster running across all build machines.

Next a deployment to TEST will be triggered. The process looks like this:

1. The latest version information is copied from the Consul key-value store running on the BUILD cluster to the key-value store running in TEST.
1. The deployment scripts running on TEST pull the updated image version from the local Consul service and pull those versions of the images from the Docker registry.

_From DEV to TEST_:
![From Dev to Test](/images/blog/delta-force-case-study/Deltaforce_Deliverypipeline_Part1_V2.png)

This provides a very fluid method for moving versions through the pipeline. It is simple because no extra tooling is required and Consul’s GUI makes it simple to see which versions are running in all environments. The simplicity is perfectly illustrated by looking at the next step in the process, a deployment to ACC.

After the latest versions have been checked in the TEST environment, an almost identical process follows during the deployment to ACC:

1. The latest version information is copied from the Consul key-value store running on the TEST cluster to the key-value store running in ACC.
1. The deployment scripts running on ACC pull the updated image version from the local Consul service and pull those versions of the images from the Docker registry.

_From TEST to ACC_:
![From Test to ACC](/images/blog/delta-force-case-study/Deltaforce_Deliverypipeline_Part2_V2.png)

The final promotion from ACC to PROD should be self-explanatory. To achieve this in Jenkins would have required a lot of extra work. With Consul, the DeltaForce team were able to build a scalable, environment agnostic deployment and version promotion mechanism with relative ease. Should they wish to add another environment in the deployment pipeline, the task would be trivial.

## Summary

Consul’s DNS, Key/Value store, and web dashboard have given DeltaForce a simple mechanism for safely delivering their software to their end-users. By consolidating multiple functionalities in one tool they have been able to reduce the complexity of the system which aids debugging. Moreover, they have been able to further decouple their system which opens up exciting new possibilities such as easily splitting their runtime environments across multiple hosts and later achieving partial deployments of their solution which will decrease their time to production. 

![From Dev to Test](/images/blog/delta-force-case-study/Deployment_Statistics.png)
