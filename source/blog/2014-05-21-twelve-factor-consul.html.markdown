---
page_title: "Twelve-Factor Applications with Consul"
title: "Twelve-Factor Applications with Consul"
author: Armon Dadgar
tags: consul
---

[The Twelve-Factor App](http://12factor.net) says that web applications
should retrieve their [configuration](http://12factor.net/config)
from environmental variables. This practice has been rapidly
adopted by modern PaaS services to enable simple
configuration changes.

With Consul, it is simple to bring this practice to your own
datacenters. If you use a PaaS for some aspects of your infrastructure
but not all of it, Consul is a great way to centralize configuration
data.

In this post, we show how Consul and
[envconsul](https://github.com/hashicorp/envconsul) can be used
to set configuration values and trigger automatic restarts on
configuration changes, all without any modifications to your
applications.

READMORE

## Why Environmental Variables?

According to the Twelve-Factor app, environmental variables should be
used for web application configuration. They have a number of benefits
when compared against configuration files or mechanisms such as Java
System Properties:

  * Environmental variables are a language- and OS-agnostic standard.

  * Environmental variables are more difficult to accidentally
    commit to a code repo.

  * Environmental variables are easy to change between environments
    such as development, staging, QA.

  * Environmental variables are easy to set and update regardless of
    deploy.

Complete PaaS solutions such as [Heroku](http://www.heroku.com)
expose helpful APIs to automatically set/get environmental variables
for an application.

When deploying applications manually, the story has historically
been a bit more complicated. With Consul, it is just as easy to set
and read configurations for developers, and easy to support and
maintain as an operations engineer.

## Consul K/V and Envconsul

Consul is able to
[store key/value data](http://www.consul.io/intro/getting-started/kv.html).
To set and retrieve key/value data, Consul has a simple API
as well as a beautiful and intuitive
[web UI](http://www.consul.io/intro/getting-started/ui.html).
It is perfect for storing configuration data.

It is clear to see how to set and retrieve configuration data,
but it isn't clear how this configuration data can become
environmental variables for an application.
[envconsul](https://github.com/hashicorp/envconsul) is a lightweight
solution that solves this problem.

With envconsul, environmental variables are stored in Consul KV
under some prefix (separated by "/"). For example, to configure
our service "foo" we might store configuration like this:

    $ curl -X PUT -d 'false' http://localhost:8500/v1/kv/foo/enabled
    true

This stores the value `false` in the key `foo/enabled`.

Then, with envconsul, we can turn these keys into environmental
variables:

    $ envconsul foo env
    ENABLED=false

`envconsul` is a very UNIX-friendly application. It takes two mandatory
arguments: a KV prefix to find data and then another application to run
along with its arguments. In the above example, we tell envconsul that
our configuration is under the prefix `foo` and we want to run the
application `env`, which simply outputs the environmental variables.

In the result, you can clearly see that `ENABLED` has been set to `false`,
just like we set in Consul KV.

If you change `env` to your application, then the environmental variables
will be exposed to that application. For example, to run a rails server
you might do the following. Note that in a real production scenario, you
probably aren't running the Rails built-in server directly, but it makes
for a good example:

    $ envconsul foo bin/rails server
    ...

## Automatic Reload

With a PaaS, your application is automatically restarted when you
change any configuration. We can achieve the same effect with Consul
and Envconsul with minimal effort.

By adding the `-reload` flag to envconsul, envconsul will terminate
(SIGTERM) and restart your application whenever a configuration
key is added, removed, or changed:

    $ envconsul -reload foo bin/rails server
    ...

The
[Consul HTTP API](http://www.consul.io/docs/agent/http.html)
supports long polling for changes in the KV for a given prefix.
Envconsul uses this to efficiently detect changes in the KV
as soon as they happen.

## Improved Process

Using Consul and envconsul for application configuration
can bring the ease of PaaS-like application configuration
into your own native environments.

For developers, they are able to set configuration without
talking to operations engineers or redeploying the application.

For operations, Consul provides a uniform solution for
service discovery and configuration across the entire
infrastructure. Operations can sleep well knowing that Consul
automatically replicates this data and stores it on disk for
easy backup.

## More from Consul

This is just one of many ways Consul can improve your datacenter.
We didn't cover the benefits of Consul's service discovery at all,
nor did we talk about the technical details about how Consul
keeps your data safe.

You can even use Consul KV and envconsul to sync configuration to
or from your datacenter and a 3rd party PaaS! For large organizations
with a hybrid cloud environment, this allows centralization of
configuration that was difficult to achieve before.

If you'd like to learn more about Consul, please visit the
[Consul website](http://www.consul.io). We plan on doing more blog
posts on applications of Consul as well some deep dive technical
blog posts on how Consul works.
