---
page_title: "Terraform in Atlas: Collaborate and Build Infrastructure in the Cloud"
title: "Terraform in Atlas: Collaborate and Build Infrastructure in the Cloud"
list_image_url: /images/blog/atlas/atlas-logo.png
post_image_url: /images/blog/atlas-terraform/activity_header.png
tags: terraform
author: Mitchell Hashimoto
---

Today we announce [Terraform](http://www.terraform.io) integration
with [Atlas](https://atlas.hashicorp.com). Build infrastructure,
collaborate on infrastructure changes, and safely make changes to
existing infrastructure all from a web interface.

Terraform is our open source project for deploying and managing infrastructure.
It supports many providers, such as AWS, Google Cloud, OpenStack,
Docker, and more. With the Atlas integration, Terraform can now manage
all of this from a web interface for a single person or an entire
team.

Atlas brings infrastructure collaboration to a level not before possible,
and makes managing infrastructures a more social process: review potential
changes, see a timeline of activity, and lock infrastructures against
dangerous changes.

Read on to learn more and see screenshots of this in action.

READMORE

## Infrastructure Activity Stream

In the "changes" view, you can view a stream of all the activity that
has been happening with your infrastructure. This includes Terraform runs
(planned and applied), Terraform state changes, and configuration changes.

From this view, you can at a glance see what changes your team has been
making as well as what changes are pending (see the "NEEDS USER ACTION"
text below). We'll briefly explain all of this below the screenshot.

![Activity Stream](/images/blog/atlas-terraform/activity.png)

As changes are made to your Terraform configuration, Atlas automatically
creates a [terraform plan](https://terraform.io/docs/commands/plan.html).
This doesn't change your infrastructure, but tells you what will change
if Terraform is applied. This puts the run into the "NEEDS USER ACTION"
state.

Once a plan is approved (by a person), Atlas locks your infrastructure
and runs Terraform. If the apply is successful, the run says "APPLIED" with
a green check mark. If there is an error for any reason, then it says
"ERRORED".

In the next section, you can see what viewing a run and collaborating on
a run is like.

## Infrastructure Collaboration

When a change in your Terraform configuration is pushed, Atlas
automatically generates a Terraform plan, as you can see below.
You can see who pushed the change, and the output of the plan.

![Plan](/images/blog/atlas-terraform/plan.png)

Within the next few weeks, Atlas will notify via email, Slack, and more
when a plan is available to notify your team that a plan is ready to
be reviewed.

At this stage, the team should collaborate and verify that the plan
makes a change that they expected and are comfortable with. When it is
approved, someone clicks the big green "Confirm & Apply" button.
When this is pressed, Terraform will queue that plan for apply, and run it:

![Apply](/images/blog/atlas-terraform/confirm.png)

## Terraform

All of this is of course powered by [Terraform](https://www.terraform.io).
This means that Atlas can manage anything Terraform can manage: AWS,
Google, OpenStack, Docker, etc. Additionally, it means that as
Terraform improves, Atlas will improve as well.

Terraform is completely open source. This means that if you ever feel like
you don't want to use Atlas, you're not locked in at all. You can take
your Terraform configuration and state and work on your own with the
Terraform project manually.

Terraform on its own is a standalone command-line application that runs
from an user's computer. Terraform in a team environment is difficult
with this model. Atlas is the collaboration platform for Terraform, making
it _fun_ to work on infrastructure with a team.

Atlas runs every Terraform plan/apply in its own isolated virtual machine.
This means that every feature of Terraform is available to you, including
executing local scripts.

## Getting Started

You can get started with Atlas and Terraform right now. We've created
an interactive tutorial to guide you every step of the way. You don't even
need an Atlas account to begin!

Visit the [interactive tutorial](https://atlas.hashicorp.com/tutorial/terraform)
to get started today.

## The Future

What we've released today is just the beginning of infrastructure collaboration.

Within the month, we'll be integrated with GitHub so that your Terraform
configuration changes pushed to GitHub automatically are sent/triggered
in Atlas. And going further than that, we have excited features planned
to make Atlas the best tool for deploying and managing infrastructure
and applications.

But with what we've launched today, we already feel very confident that
we've built the most enjoyable and open tool for collaborating on
infrastructure that exists today.

Atlas is our commercial product currently in tech preview. We will be
announcing pricing soon. When Atlas pricing is announced, there will be
a generous free tier, so you don't need to worry about being charged for
playing with Atlas. If you're using Atlas at a larger scale and have concerns,
email us at
<a href="mailto:hello@hashicorp.com">hello@hashicorp.com</a> and we'd
be happy to talk with you.
