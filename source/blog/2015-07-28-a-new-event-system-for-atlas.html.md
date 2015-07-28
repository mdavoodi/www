---
page_title: "A New Event System for Atlas"
title: "A New Event System for Atlas"
list_image_url: /images/blog/atlas/atlas-logo.png
post_image_url: /images/blog/a-new-event-system-for-atlas/new-events-header.jpg
tags: atlas
author: Seth Vargo
---

A few weeks ago we started distributing a brand new event-tracking and auditing
system in Atlas. Today we are excited to announce that the new Atlas event and
auditing system is available to all Atlas users. Read on to learn more about the
new event functionality in Atlas.

READMORE

### Background

If you previously used the event logging in Atlas the following screenshot
should seem familiar:

![](/images/blog/a-new-event-system-for-atlas/old-events.jpg)

There were a number of challenges in implementing our first event system, and we
have taken those challenges as learning opportunities in this new system.

### Humans First

One common feedback item about the previous event system was that it was very
difficult to scan and parse as a human. We designed the previous event system
to behave much like a speadsheet, but that turned out to be the wrong user
experience.

In the new system, each event is a human-friendly format with the important
components in bold and linked if possible. Below you can see the old event
system (top) and the new event system (bottom) for a quick comparison.

![](/images/blog/a-new-event-system-for-atlas/new-events-human.jpg)

In the future, we are going to extend the functionality to export to CSV and
other machine-parsable formats, but we wanted the user interface for the new
event system to be human-first. If you need CSV or other machine-parsable
format of your event log, please contact support.

### Less Enables More

Another common feedback item was that the prior event system displayed too much
information. It was difficult to filter through the mounds of information; they
were suffering from information overload. Even moderate Atlas use would result
in hundreds of events, making it very difficult to distinguish important events
from traditional "logs".

One of the biggest changes in the new event system is that we carefully capture
only the most important events to users and display them in the logs. As part of
this transition, we are able to capture even more information (such as attribute
diffs) that was not previously possible.

### Attribute Diffs

In addition to capturing more information about the user, browser, and IP
address, the new event system calculates attribute diffs when possible. For
example, if you update a variable, rename a resource, or update a description,
you will see a diff or all the updated attributes:

![](/images/blog/a-new-event-system-for-atlas/new-events-diff.jpg)

This allows administrators to see and track changes, even after changes have
been applied. All resource diffs are
[securely encrypted using Vault](/blog/how-atlas-uses-vault-for-managing-secrets.html)
since attribute diffs could contain sensitive data.

### Getting Started

The new event system is currently live for all users. To view the event system,
you will need to have "admin" permissions on the resource and then visit the
"Event log" from the resource page.

![](/images/blog/a-new-event-system-for-atlas/new-events.jpg)

### Thank You

We would like to extend a special thank you to all the customers who helped us
beta test this new event system and provide valuable feedback. If you or your
organization is interested in trying new beta features in Atlas, get in touch by
emailing <a href="mailto:support@hashicorp.com?subject=Beta%20Testing%20for%20Atlas">support@hashicorp.com</a>.
