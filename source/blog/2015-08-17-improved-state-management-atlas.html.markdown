---
page_title: "Improved Terraform State Management in Atlas"
title: "Improved Terraform State Management in Atlas"
list_image_url: /images/blog/atlas/atlas-logo.png
post_image_url: /images/blog/atlas-remote-state/header.png
tags: atlas, terraform
author: Jack Pearkes
---

Terraform remote state enables teams to collaborate when using Terraform,
saving the state your infrastructure as changes are made and resources
are added and removed. It stores infrastructure identifiers, dependency
information and attributes referenced across configuration.

Atlas provides a remote state API to store this state, and allows
teams to modify infrastructure from Atlas or operator machines while
sharing changes made.

We've made some improvements to remote state management in Atlas. Read
on to learn more.

READMORE

### Plain Text Difference

Changes made to state between versions are highlighted and shown
in a diff format.

![Terraform state diff](/images/blog/atlas-remote-state/state-diff.png)

You can easily navigate through the history of changes made to state
to understand how Terraform is operating on your infrastructure over
time.

### State Rollbacks and Raw State

Rollback to a specific version of state, reverting changes made after
that point. This requires confirmation of the state version number.

![Terraform remote state rollback](/images/blog/atlas-remote-state/rollback.png)

Additionally, you can download the raw state in order to inspect it
locally.
