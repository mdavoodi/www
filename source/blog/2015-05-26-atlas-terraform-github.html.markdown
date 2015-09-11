---
page_title: "Terraform in Atlas: GitHub Integration"
title: "Terraform in Atlas: GitHub Integration"
list_image_url: /images/blog/atlas/atlas-logo.png
post_image_url: /images/blog/atlas-terraform-github/github-show-ui.png
tags: atlas, terraform
author: Seth Vargo
---

We are very excited to announce Atlas integration with GitHub to
automatically turn Terraform configuration stored in GitHub repositories
into managed infrastructure. This eliminates
the need to install Terraform locally across your team of operators.

With the new GitHub integration, Terraform configurations can be changed
in GitHub and applied via Atlas with rich history, auditability and
collaboration.

Terraform is an open source project by HashiCorp for deploying and
managing infrastructure. It supports many providers, such as AWS,
Google Cloud, OpenStack, and Docker.

Atlas is HashiCorp’s commercial product which allows teams to version and
collaborate on infrastructure changes.

Read on to learn more about the integration and to view GitHub, Terraform,
and Atlas in action.

READMORE

## Managing Terraform with GitHub

Atlas will automatically pull changes made in a GitHub repostitory
and run a Terraform plan that can be subsequently applied.

The Atlas UI displays information about the changes made, as well as
the status and log output of Terraform running both the `plan` and `apply`
steps. Terraform requires confirmation to apply changes.

![Tutorial Plan](/images/blog/atlas-terraform-github/tutorial-plan.png)

## Pull Requests

Combined with [pull requests](https://help.github.com/articles/using-pull-requests/),
it is possible to preview changes made during normal
GitHub collaboration. This gives an opportunity to review and approve
infrastructure changes, as well as show a deterministic view of those changes.

Any pull request will automatically run a plan in Atlas, marking the pull
request as ready to merge upon successful Terraform plan completion. If a plan fails,
the pull request will be marked accordingly.

![GitHub flow](/images/blog/atlas-terraform-github/github-flow.png)

## Getting Started

You can get started with the Atlas + GitHub integration right now
through our [interactive tutorial](https://atlas.hashicorp.com/tutorial/terraform-github).

To learn more about each step of the Atlas GitHub integration, read below.

## Terraform

Atlas uses [Terraform](https://terraform.io) to manage infrastructure. This means that
Atlas can manage anything Terraform can manage: AWS, Google, OpenStack,
Docker, etc. Improvements to Terraform by the community will improve both the commercial and open
 source aspects of the Atlas and Terraform.

Terraform is completely [open source](https://github.com/hashicorp/terraform).
One powerful advantage of this is that you can take your Terraform configuration
and state and work on your own with the Terraform project manually.

Atlas is the collaboration platform for Terraform, making it safe and fun to
work on infrastructure with a team. Just as version control for application
code reduces the risk in making application changes, Atlas with Terraform
helps reduce the risk of making infrastructure changes.

## Authenticating with GitHub

Atlas uses OAuth to authenticate and link with GitHub. Simply visit your
user settings page in Atlas and click on the "Connections" tab.  Atlas requires
read permissions for repositories to pull configuration and write permission
to configure and manage webhooks.

You can link an existing Terraform configuration to GitHub by
visiting the integrations tab of the environment:

![Integrations Tab](/images/blog/atlas-terraform-github/integrations.png)

Authentication information is encrypted securely by
[Vault](https://vaultproject.io) using its
[transit backend](https://www.vaultproject.io/docs/secrets/transit/index.html) (AES-GCM-256).
We will be publishing a more detailed blog post on how we integrated Vault into Atlas
soon.

## The Future

The HashiCorp product line for managing infrastructure puts emphasis on
representing all aspects of infrastructure as code. This allows for
intuitive infrastructure versioning, auditability, repeatability, and
collaboration.

Over the next few weeks, we will be releasing GitHub integration across the various
components of Atlas including Packer builds. This integration brings us one step closer to
the [Atlas Mindset: Version Control for Infrastructure](/blog/atlas-mindset.html) and
allows teams to manage infrastructure responsibly with Atlas.

Atlas is HashiCorp's commercial product currently in tech preview. We will be
announcing pricing soon. When Atlas' pricing is announced, there will be a
generous free tier, so do not worry about being charged for playing with Atlas.
In fact, there is no credit card required. If you are using Atlas at a larger
scale and have concerns, email us at hello@hashicorp.com and we would be
happy to talk with you.

