---
page_title: "Vagrant Cloud: Organizations, Box Hosting and the end of Beta"
title: "Vagrant Cloud: Organizations, Box Hosting and the end of Beta"
list_image_url: /images/blog/vagrant-cloud-leaves-beta/logo-side.png
post_image_url: /images/blog/vagrant-cloud-leaves-beta/header.png
author: Jack Pearkes
tags: vagrant-cloud
---

Today we take Vagrant Cloud officially out of beta, release
pricing plans, hosted boxes, organization support with ACL
control along with share customization. This includes a transition
plan for free users on paid features, like private boxes. Read on for more.

It's been just over 2 months since we launched Vagrant Cloud into
beta. At our current pace, we're just a week or two away from recording
our millionth box download and couldn't be happier. The community
adoption and embrace of Vagrant Cloud, as well as the rapid
inclusion into organizational workflows we've seen has made it
clear that Vagrant Cloud goes a long way in support the Vagrant experience.

So, in an effort to continue development and momentum, we're releasing
both our pricing plans as well as several new features.

### New Features

- **Organizations**. Manage teams, boxes and billing in an organization
account. Existing users can [create an organization](https://vagrantcloud.com/organizations)
 that makes boxes available on a user namespace, i.e `vagrantcloud.com/hashicorp/precise64`. If
you've already made a user in place
of an organization, you can use our [migration tool](https://vagrantcloud.com/help/cloud/migrate-organization).

- **Box Hosting**. You can now upload boxes to Vagrant Cloud. We take
care of storing, serving and authenticating access to the box files. This
is also available on the API, allowing you to automate the building and
uploading of boxes for distribution to your team. Box hosting requires
an upgraded account. Pricing is detailed below.

- **Custom Shares**. You can now specify custom names and domains.
This will let you do something like: `bob.example.com`, routing directly
to your Vagrant Box while share is running.

### What Remains Free

Vagrant Cloud as you've known it since launch remains completely free,
with the exception of private boxes.

- **Shares**. Shares, other than the customization features, remain free.
This is how you know them today.
- **Public Boxes**. Creating public boxes remains free, with unlimited
public collaboration. Uploading public box files (using the new hosting
feature) requires an upgraded plan, but self-hosted box files are still free.

### New Pricing

There are now 3 available plans on Vagrant Cloud: Free, Pro and
Organization. Additionally, we charge for download bandwidth for hosted boxes,
at $0.12/per GB.

You can see a detailed breakdown and more details on the
[pricing page](https://vagrantcloud.com/pricing).

### Transition Plan

Currently, many users who participated in our beta are using features
that are paid as of this release.

On July 15th, 2014, users of Vagrant Cloud who are utilizing features that
we're previously free and are now paid will need to upgrade to continue
using those features. This includes:

- Private boxes
- Private collaborations

In order to continue accessing the private boxes, you'll need to upgrade
the account hosting them to a paid plan. You will be billed based
on the number of private collaborators your currently have.

Until then, you'll be on the Pro plan, giving you access to all of those
features.

If you do not upgrade before July 15th, you'll simply be downgraded
to the free plan. If you have private boxes, you'll lose access to
them, though they will remain visible and attached to your account.

If you ever upgrade, access to those private boxes will be restored.
Data will not be deleted.

They'll be notices in Vagrant Cloud, as well as an email notification sent
alerting users to the transition.

If anything is unclear please email us at [sales@hashicorp.com](mailto:sales@hashicorp.com).

### Private Cloud

These features (box hosting, custom shares, organizations and ACLs) are
also all available in Vagrant Private Cloud, which interested organizations
have been testing during the beta period.

Vagrant Private Cloud shares the same codebase as what is running publicly
on vagrantcloud.com and runs completely within your firewall. It does
not require an external internet connection and does not phone home.

The primary feature available to private cloud customers is optional
LDAP integration, allowing you to use your existing LDAP directory to
authenticate users. Box hosting is done through any S3 compatible service.

If you're interested in learning more about Private Cloud, please
email us at [sales@hashicorp.com](mailto:sales@hashicorp.com).
