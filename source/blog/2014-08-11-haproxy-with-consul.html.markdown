---
page_title: "HAProxy with Consul"
title: "HAProxy with Consul"
tags: consul
author: Armon Dadgar
---

Consul provides both a DNS and HTTP interface for doing service
discovery. This works for broad set of uses, but latency sensitive
or high-throughput applications can benefit from reducing the overhead
of service discovery by using a client-side load balancer such as
HAProxy.

Using [consul-haproxy](https://github.com/hashicorp/consul-haproxy)
makes it incredibly simple to provide a configuration template for
HAProxy and have it dynamically populated based on service information
from Consul. This allows HAProxy to be updated seamlessly with zero downtime.
While this approach requires a prior configuration, it also reduces
the per-request overhead of service discovery.

READMORE

## Why use a load balancer?

As mentioned, Consul provides both DNS and HTTP interfaces for
service discovery. The DNS interface makes it simple for applications
to make use of Consul's discovery features without having to make
code changes. Conversely, the HTTP API can be used to get rich
information about services and enables clients to do intelligent
routing and load balancing. However, this requires that clients be
Consul-aware which isn't always possible.

Deploying an intermediate load balancer is a middle ground approach.
Using [consul-haproxy](https://github.com/hashicorp/consul-haproxy) information
from Consul is used to dynamically configure a local HAProxy instance.
This allows applications to route to a local HAProxy instance which can
perform the rich routing and load balancing without the end application
being Consul-aware.

Using the DNS interface also imposes a small latency cost per-request.
This is generally not an issue, but for high-throughput or latency
sensitive applications it is preferable to avoid that cost. Using
`consul-haproxy` allows an application to talk directly to the load
balancer without making any additional requests. The load balancer
is reconfigured anytime the underlying service changes ensuring an
up-to-date configuration.

## consul-haproxy

[consul-haproxy](https://github.com/hashicorp/consul-haproxy) provides the
glue required to read service information from Consul and dynamically
configure an HAProxy instance. It works by specifying any number of "backends"
which are services filtered by name, tag or datacenter. These backends
are interpolated into a template configuration file which HAProxy consumes.
Lastly, `consul-haproxy` monitors the backends for changes and regenerates
the configuration and reloads HAProxy to ensure new nodes are added and old
nodes removed.

The first step with `consul-haproxy` is to specify a set of backends.
A backend has a name and a definition. Multiple definitions for a given
backend can be given to merge a pool of servers together.
For example, suppose we have a `webapp` service distributed between three datacenters,
and we want to route requests to all of them. To do this, we could define our
backends like:

    app=webapp@dc1
    app=webapp@dc2
    app=webapp@dc3

This defines the `app` backend which contains all the instances
of `webapp` service in all three datacenters. Backends support filtering
on datacenter, service, and tags. They also allow port-overrides to be specified.
They are documented in more detail on the [consul-haproxy page](https://github.com/hashicorp/consul-haproxy).
To make use of backends, we need to provide an input template, which might look like:

    global
        daemon
        maxconn 256

    defaults
        mode tcp
        timeout connect 5000ms
        timeout client 60000ms
        timeout server 60000ms

    listen http-in
        bind *:80{{range .app}}
        {{.}} maxconn 32{{end}}

This template makes use of the [Golang templating language](http://golang.org/pkg/text/template/).
Using the templating language is quite simple. Because we defined the
`app` backend, that variable is available for us to iterate over.
Now that we've specified our backends and template, we can use `consul-haproxy`
to perform a dry-run to get an example output:

    consul-haproxy -in in.conf -backend "app=webapp@dc1" -backend "app=webapp@dc2" -backend "app=webapp@dc3" -dry

Using the `-dry` flag, `consul-haproxy` simply renders the template to stdout so that
we can verify renders what we would expect. In this case, an example output would look like:

    global
        daemon
        maxconn 256

    defaults
        mode tcp
        timeout connect 5000ms
        timeout client 60000ms
        timeout server 60000ms

    listen http-in
        bind *:80
        server 0_nyc1-worker-1_webapp 162.243.162.228:80 maxconn 32
        server 0_nyc1-worker-2_webapp 162.243.162.226:80 maxconn 32
        server 0_nyc1-worker-3_webapp 162.243.162.229:80 maxconn 32
        server 1_sfo1-worker-1_webapp 107.170.196.151:80 maxconn 32
        server 1_sfo1-worker-2_webapp 107.170.195.154:80 maxconn 32

The list of servers in the `http-in` block has been dynamically populated
using the service catalog from Consul.

## Automatic Reload

When actually running `consul-haproxy` we must provide an output
path and a reload command. This allows the configuration to be written
out and HAProxy to be reloaded with the latest configuration.

By adding the `-reload` flag, `consul-haproxy` will invoke the given
command any time the configuration changes, allowing HAProxy to be
reloaded:

    $ consul-haproxy ... -reload "sudo reload haproxy"

The [Consul HTTP API](http://www.consul.io/docs/agent/http.html)
supports long polling for changes in the service catalog, which enables
`consul-haproxy` to efficiently detect changes and update the configuration
for HAProxy in real-time.

## Improved Process

Using Consul with consul-haproxy allows intermediate
load balancers to be configured in real-time without being
Consul-aware. This allows applications to make use of
Consul discovery features without sacrificing latency or
throughput.

For developers, they are able to leverage Consul's features
without updating their application.

For operations, Consul provides a uniform solution for
service discovery without needing a patch work of various
tools.

If you'd like to learn more about Consul, please visit the
[Consul website](http://www.consul.io). We plan on doing more blog
posts on use cases of Consul as well some deep dive technical
blog posts on how Consul works.
