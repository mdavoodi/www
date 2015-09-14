---
page_title: "Huawei builds an Apache Spark Software Appliance with Atlas"
title: "Huawei builds an Apache Spark Software Appliance with Atlas"
list_image_url: "/images/blog/huawei-case-study/huawei-logo.jpg"
tags: case-study
author: Shuo Yang (Huawei)
---

[Huawei Technologies](http://www.huawei.com/en/) is a leading global ICT solutions provider, which provides enterprise solutions, consumer devices and carrier networks. Headquartered in Shenzhen, China, Huawei recorded profit of USD 5.5 billion in 2014.

Huawei has been actively investing in the areas of enterprise IT infrastructure solutions, such as [OpenStack](http://www.openstack.org/) based cloud infrastructure and [Spark](http://spark.apache.org/) based BigData infrastructure, where the open source software stack is the core product offering. This blog summarizes Huawei's experiences in building and deploying an Apache Spark cluster using HashiCorp's Atlas.

## Problem Statement: Fully automate the deployment of an Apache Spark cluster

In the context of building a large scale infrastructure process, such as a Spark deployment, Huawei needed to create an automated pipeline to build the deployable artifacts, deploy those out, and later on update the infrastructure as needed.

In the era of _'Infrastructure as Code'_, as a large engineering organization, Huawei cares a lot about the software engineering aspect of the infrastructure automation. A core goal was to see if we could build a solution where 90% of the code was reusable and only 10% needed to be tailored for different customer use cases. We also wanted to have a flexible approach, where if the infrastructure automation code targeted Ubuntu OS we could extend it out to a CentOS system with minimal additional effort. This is the **_development cost_** aspect of providing an infrastructure solution.

Some other questions we were looking to get answers to were if we could simply change some parameters to customize some environments while keeping the remaining complex infrastructure automation code untouched. Could we give ourselves the peace of mind that our testing infrastructure, which exercised extensive test suites, did get reflected into our customer's infrastructure deployment? Moreover, to avoid the accidental misconfiguration errors we wanted to pre-validate the plan and deploy the infrastructure solution in an immutable way across the testing, staging and production environments. This was the **_quality and safety_** aspect of providing an infrastructure solution we were looking to validate.

If our infrastructure automation code from artifacts release to production deployment met the above two requirements then we could confidentially provide our customers with a high quality infrastructure product in a nimble and responsive manner.

## Project Scope
With _Infrastructure as Code_ as a guiding principle for the engagement, Huawei and HashiCorp built a project that enabled automated and repeatable deployment of a Spark cluster to Amazon Web Services.

The scope and requirements of the project were:

- _Automated deployment_ - from "zero" to live Spark cluster in one-click
- _Centralized runtime view_ - have a "single pane of glass" to view the live state of the cluster
- _Dynamic service discovery_ - no manual reconfiguration as the cluster changes
- _Parameterized configuration_ - region, cluster size, instance size, etc.

Note that Amazon Web Services is our example scenario testbed in this project, with the ultimate goal to gain enough confidence that the infrastructure automation code for building Spark clusters can and will work across different cloud platforms, including our customer's private OpenStack cloud.

## Implementation

Utilizing Packer, Terraform, Consul, and Atlas from the HashiCorp product suite, the team was able to complete the project and satisfy the requirements in a matter of days.

<img src="/images/blog/huawei-case-study/atlas-spark-cluster.png" alt="Atlas Spark Cluster" style="width: 400px;"/>

### Packer for Immutable Artifacts

Reducing the number of moving parts during deployments is a key tenet of highly efficient deployment workflows. If your deployments include repetitive downloads and software installations across each new server that is deployed, any network interruption or package mirror cache miss can cause delays or failures in deployments.

Packer helps isolate these software download and installation steps to one of the very first steps of infrastructure software deployments. Supporting many provisioners (inputs such as bash scripts or configuration management tools like Puppet and Ansible) and many builders (outputs such as Amazon Machine Images), Packer is indispensable in workflows requiring confidence in their application builds. For us, supporting multiple provisioners is essential as the background and skill-set vary significantly across the board, some team may have adopted new configuration management tools such as Ansible and some may have legacy scripts.

<pre class="prettyprint">
{
  "builders": [
    {
      "type":          "amazon-ebs",
      "access_key":    "{{user `aws_access_key`}}",
      "secret_key":    "{{user `aws_secret_key`}}",
      "region":        "{{user `region`}}",
      "source_ami":    "{{user `source_ami`}}",
      "instance_type": "t2.micro",
      "ssh_username":  "ubuntu",
      "ami_name":      "{{user `atlas_name`}} {{timestamp}}"
    }
  ],
  "post-processors": [
    [
      {
        "type": "atlas",
        "only": ["amazon-ebs"],
        "artifact": "{{user `atlas_username`}}/{{user `atlas_name`}}-amazon-ebs",
        "artifact_type": "aws.ami",
        "metadata": {
          "created_at": "{{timestamp}}"
        }
      }
    ]
  ]
  ...
}
</pre>
_[packer/consul.json](https://github.com/hashicorp/atlas-examples/blob/master/spark/packer/consul.json)_  

For this Spark infrastructure automation project, Packer was used to build AMIs for the various Consul and Spark roles. Since Consul was used on the Spark nodes as well (more details below), Packer was able to re-use installation scripts across each AMI artifact that was produced. With Packer integrated into Atlas' _Builds_ support, new artifacts were built and staged with each change made to the installation scripts and Packer configurations on GitHub.

### Terraform for Deployment Automation

The next step in taking an application from a deployable artifact to a live environment is deployment automation. Historically, in the physical world, deploying new infrastructure has been time-consuming, costly, and error prone. With the advent of cloud computing, the time and cost to provision new infrastructure has been greatly reduced, but infrastructure environments are more complex than ever and managing these by hand or even with rudimentary automation is still error-prone with little traceability of changes.

Just as teams version control their application code, Terraform brings these same capabilities to version infrastructure. Teams can collaborate in a common configuration language that defines each component of their infrastructure - to each distinct configuration property, to dependencies between resources, to parameterizing different environments. Terraform enables developers and operators to see an execution plan of changes before applying them,  allowing them to proceed with confidence or revert and adjust configurations - a peace of mind assurance moment.

<pre class="prettyprint">
resource "aws_instance" "spark-master" {
  instance_type = "${var.instance_type}"
  ami = "${atlas_artifact.spark-master.metadata_full.region-us-east-1}"
  key_name = "${aws_key_pair.spark-poc.key_name}"

  user_data = "${template_file.spark-master-start.rendered}"

  vpc_security_group_ids = ["${aws_security_group.admin-access.id}","${aws_security_group.spark-master.id}"]
  subnet_id = "${module.vpc.subnet_id}"

  tags {
    Name = "${format("spark-master-%04d", count.index)}"
  }
}
</pre>
_[terraform/instances.tf](https://github.com/hashicorp/atlas-examples/blob/master/spark/terraform/instances.tf)_  

With Terraform, the Spark environment was able to created and destroyed on demand - with the confidence that each time the environment was identical to the previous one. Terraform also made it easy to scale the Spark cluster size up and down as needed by simply changing a variable in a Terraform configuration file. Atlas provided the centralized collaboration space for reviewing and approving infrastructure changes.

### Consul for Runtime Orchestration

In the age of cloud computing and complete infrastructure automation, infrastructure environments are more dynamic than ever. Traditionally, infrastructure configurations were managed by hand, which is error-prone in such a complex environment; or in more recent years with configuration management tools, but even these tools can be too cumbersome for today's large scale environments -- they were designed as 'build time' (early-bind) changes rather than 'runtime' (late-bind) changes.

Consul makes runtime service discovery and configuration easy - with first-class support for service registration and integrated health checking. Through a number of interfaces, Consul can adapt the whole infrastructure's topology and configuration when nodes are created and removed and, more importantly, as nodes become unhealthy and return to a healthy state.

<pre class="prettyprint">
{
  "service": {
    "name": "spark-master",
    "port": 7077,
    "checks": [
      {
        "script": "ps aux | grep -v grep | grep org.apache.spark.deploy.master.Master",
        "interval": "10s"
      }
    ]
  }
}
</pre>
_[consul.d/spark-master.json](https://github.com/hashicorp/atlas-examples/blob/master/spark/packer/files/consul.d/spark-master.json)_  

For the our Spark project, Consul provided a realtime view of the health of the entire Spark cluster and a service registry for the cluster. As the Spark cluster size increased and decreased, Consul tracked healthy and unhealthy nodes automatically. As the Spark master node became unhealthy and was replaced, Consul would automatically update the Spark slave configuration and restart the cluster to adjust to the new master node. Atlas provided the centralized view of the service and node catalog as well as the view into the cluster's realtime health with a full history of alerts.

### Atlas for Centralized Collaboration and Runtime Insight

Operational awareness and transparency are as important as ever as infrastructure complexity continues to grow at an increasing pace. As development and operations teams grow, often times dispersed around the world, providing insight into _who_ changed _what_ _when_ gets exceedingly difficult, let alone having a historical record for post-mortems, auditability, and change tracking.

<img src="/images/blog/huawei-case-study/atlas-developer-workflow.png" alt="Atlas Developer Workflow" style="width: 700px;"/>

HashiCorp's Atlas is a modern infrastructure deployment tool. Atlas integrates each of HashiCorp's development and infrastructure management tools (Packer, Terraform, Consul and more) into a unified dashboard and collaboration space, which we have already alluded in the previous sections describe each single step of building our Spark infrastructure. Atlas solves the who/what/when problem, providing a central location for teams to make and track changes, see and resolve alerts, i.e., a single pane of infrastructure automation code development. Specifically with our Spark project, Atlas provided the central dashboard to track changes to the Spark cluster. As the cluster was recreated or resized as needed, the entire team could track these changes from commit to deployment. Atlas' view into node and service health also provided a realtime runtime view of the Spark environment with a full log of alerts and events.

## Summary

In this project we used HashiCorp tools to automate the infrastructure solution pipeline from artifacts release to production deployment. We knew from the start that the HashiCorp tools fit our bill at a conceptual level, for example, Packer is a great tool for the work of release stage, and Terraform is a great tool for the work of rollout stage, but by executing this PoC we understood some of the subtle benefits we did not expected before this project, such as 'late-binding' could be done is a much clever way by adopting HashiCorp Consul.

At under 2,000 lines of code, including comments and blank lines, the final project came in at a very consumable and understandable size. While _lines of code_ is never the final measure of a project, we do feel it has a certain correlation to the long term maintainability of the overall product. Given that the code structure can be clearly understood, a new team member can easily come in and augment our solution to adapt to different customer environments.
