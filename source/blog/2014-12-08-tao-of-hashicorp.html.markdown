---
page_title: The Tao of HashiCorp
title: The Tao of HashiCorp
list_image_url: /images/hashicorp-black-large.png
post_image_url: /images/hashicorp-black-large.png
author: Mitchell Hashimoto, Armon Dadgar
---
The Tao of HashiCorp is the foundation that guides our vision, roadmap, and product design. As you evaluate using or contributing to HashiCorp’s products, it may be valuable to understand the motivations and intentions for our work.

READMORE

## Workflows, not Technologies
The HashiCorp approach is to focus on the end goal and workflow, rather than the underlying technologies. Software and hardware will evolve and improve, and it is our goal to make adoption of new tooling simple, while still providing the most streamlined user experience possible.
Product design starts with an envisioned workflow to achieve a set goal. We then identify existing tools that simplify the workflow. If a sufficient tool does not exist, we step in to build it. This leads to a fundamentally technology-agnostic view — we will use the best technology available to solve the problem. As technologies evolve and better tooling emerges, the ideal workflow is just updated to leverage those technologies. Technologies change, end goals stay the same.

## Simple, Modular, Composable
The Unix philosophy is widely known for preaching the virtues of software that is simple, modular and composable. This approach prefers many smaller components with well defined scopes that can be used together. The alternative approach is monolithic, in which a single tool has a nebulous scope that expands to encompass new features and capabilities. We like to think of the components as blocks that are functional on their own, and can be combined in new and innovative ways.

The simple, modular, composable approach allows us to build products at a higher level of abstraction. Rather than solving the holistic problem, we break it down into constituent parts, and solve those. We build the best possible solution for the scope of each problem, and then combine the blocks to form a solid, full solution.

## Communicating Sequential Processes
Given our belief in simple, modular, composable software, we have several tenets for combining those pieces into a connected system. Communicating Sequential Processes (CSP) is a model of computation wherein autonomous processes connected via a network are able to communicate. We believe that the CSP approach is necessary for managing complexity and building robust scalable systems in a Service Oriented Architecture. Each service should be treated as an individual process that then communicates with other services via an API.

CSP represents the best known way to write software and organize services together to form a system. Nature itself provides the best examples; even the human body is a system of interconnected services — respiratory, cardiovascular, nervous, immune, etc.

## Immutability
Immutability is the inability to be changed. This is a concept that can apply at many levels. The most familiar implementation of immutability is version control systems; once code is committed, that commit is forever fixed. Version control systems, such as git, enjoy widespread use because they offer tremendous benefits. Code becomes versionable, allowing rollback and roll forwards. You can inspect and write code atomically. Using versions enables auditing and creates a clear history of how the current state was reached. When something breaks, the origin of the error can be determined using the version history.

The concept of immutability can be extended to many aspects of infrastructure — application source, application versions, and server state. We believe that using immutable infrastructure leads to more robust systems that are simpler to operate, debug, version and visualize.

## Versioning through Codification
Codification is the belief that all processes should be written as code, stored, and versioned. Operations teams have historically relied on oral tradition to pass along the knowledge of how to build, upgrade and triage infrastructure. But information was easily lost or hidden from the people who needed it most. Codification of critical knowledge promotes information sharing and prevents data loss, as any changes to process are automatically stored and versioned.

HashiCorp products are all designed to follow the codification of knowledge paradigm. Any changes a user makes are versioned and stored to keep a clean history of process.

## Automation through Codification
System administration typically requires an operator to manually make changes to infrastructure, making the position’s responsibilities difficult to scale. The scale of infrastructure under management is forever increasing, and manual system administration techniques have struggled to to match this new scale. Automation to manage more systems with less overhead is the only option.

While there are many approaches to automation, we promote codification. Codification allows for knowledge to be executed by machines, but still readable by operators. Automated tooling allows operators to increase their productivity, move quicker, and reduce human error.  Machines can automatically detect, triage and resolve issues.

## Resilient systems
Resilient systems are built to withstand unexpected inputs and outputs. To accomplish this, the system must have a desired state, a method to collect information on the current state, and a mechanism to automatically adjust the current state to return to the desired state.

We believe that applying this sort of systems rigor to infrastructure is critical to achieve the highest levels of reliability. HashiCorp products will always recognize a desired state through codified knowledge. They will collect real-time information through functionally independent components. And they will provide the tooling to self-heal and auto-recover.

## Pragmatism
We strongly believe in the value of pragmatism when approaching any problem. Many of the principals we believe in like immutability, codification, automation, and CSP are ideals which we aspire towards and not requirements that we dogmatically impose. There are many situations in which the practical solution requires reevaluating our ideals.

Pragmatism allows us to assess new ideas, approaches, and technologies and how they may be adopted to improve HashiCorp’s best practices. It would be a mistake to view this as a compromise of first principles, but rather open-mindedness and humility to accept that we may be wrong. The ability to adapt is critical to innovation and one we take pride in.
