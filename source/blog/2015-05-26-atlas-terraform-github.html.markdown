---
page_title: "Terraform in Atlas: GitHub Integration"
title: "Terraform in Atlas: GitHub Integration"
list_image_url: /images/blog/atlas/atlas-logo.png
post_image_url: /images/blog/atlas-terraform-github/github-show-ui.png
tags: atlas, terraform
author: Seth Vargo
---

The HashiCorp product line for managing infrastructure puts emphasis on
representing all aspects of infrastructure as code. This allows for
intuitive infrastructure versioning, auditability, repeatability, and
collaboration.

We are very excited to announce Atlas integration with GitHub to
automatically turn infrastructure as code into deployed infrastructure.
Store and collaborate on Terraform configurations in GitHub, and
automatically generate Terraform plans in Atlas on each git commit or
pull request.

Terraform is an open source project by HashiCorp for deploying and
managing infrastructure. It supports many providers, such as AWS,
Google Cloud, OpenStack, and Docker. Atlas is HashiCorp’s commercial
product which allows teams to version and collaborate on infrastructure
changes. With the new GitHub integration, it is possible to configure and
manage infrastructure without installing or running Terraform on your local
machine.

Developers on your team don’t need to learn a new command line tool and
can start managing infrastructure right away.

Read on to learn more about the integration and to view GitHub, Terraform,
and Atlas in action.

READMORE

## Getting Started

You can get started with the Atlas + GitHub integration right now
through our [interactive tutorial](https://atlas.hashicorp.com/tutorial/terraform-github).

To learn more about each step of the Atlas GitHub integration, read below.

## Terraform

The GitHub + Atlas integration is powered by Terraform. This means that
Atlas can manage anything Terraform can manage: AWS, Google, OpenStack,
Docker, etc. Additionally, it means that as Terraform improves, Atlas
will improve as well.

Terraform is completely [open source](https://github.com/hashicorp/terraform).
 You can take your Terraform configuration and state and work on your own with
 the Terraform project manually; there is no vendor-lock.

Terraform on its own is a standalone command-line application that runs
from a user's computer. Terraform in a team environment is difficult with
this model. Sharing and managing remote state is often painful and easily
becomes out of sync. Atlas is the collaboration platform for Terraform,
making it safe and fun to work on infrastructure with a team. Just as
version control for application code reduces the risk in making application
changes, Atlas reduces the risk of making infrastructure changes.

## Authenticating with GitHub

Atlas uses OAuth to authenticate and link with GitHub. Simply visit your
settings page and click on the "Connections" tab.

GitHub will ask you to verify the request, including the permissions
Atlas requires. Atlas requires read permissions for repositories so we
can ingress your configurations and requires write permission so we can
configure and manage webhooks for Atlas.

Once authenticated, you can follow the interactive tutorial to get started.
You can also link an existing Terraform configuration to GitHub by
visiting the integrations tab.

![Integrations Tab](/images/blog/atlas-terraform-github/integrations.png)

Your GitHub authentication information is encrypted securely by
[Vault](https://vaultproject.io) using Vault's
[transit backend](https://www.vaultproject.io/docs/secrets/transit/index.html) (AES-GCM-256).
The Rails application and data store are never privy to the encryption key,
so even if an attacker could gain access to the stored encrypted values, they
would also need to compromise Vault to get the decryption key. We will be
publishing a more detailed blog post on how we integrated Vault into Atlas
shortly.

## Using the GitHub Flow

Combined with [the GitHub Flow](https://help.github.com/articles/github-flow-in-the-browser/),
it is possible to control and manage entire infrastructure without ever installing
Terraform.

![GitHub flow](/images/blog/atlas-terraform-github/github-flow.png)

## The Future

The Atlas + GitHub integration is just the start of some amazing new
features and functionality we have planned for Atlas. Over the next
few weeks, we will be releasing GitHub integration across the various
components of Atlas including applications and Packer build configurations.
This integration brings us one step closer to
the [Atlas Mindset: Version Control for Infrastructure](/blog/atlas-mindset.html) and
allows teams to manage infrastructure responsibly with Atlas.

Atlas is HashiCorp's commercial product currently in tech preview. We will be
announcing pricing soon. When Atlas' pricing is announced, there will be a
generous free tier, so do not worry about being charged for playing with Atlas.
In fact, there is no credit card required. If you are using Atlas at a larger
scale and have concerns, email us at hello@hashicorp.com and we would be
happy to talk with you.
