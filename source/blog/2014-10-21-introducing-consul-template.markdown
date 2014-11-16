---
page_title: "Introducing Consul Template"
title: "Introducing Consul Template"
list_image_url: /images/blog/introducing-consul-template/small.png
post_image_url: /images/blog/introducing-consul-template/large.png
author: Seth Vargo
tags: consul
---

Today we are releasing [Consul Template][], a standalone application that is
packed full of amazing new features.

Consul Template queries a [Consul][] instance and updates any number of
specified templates on the filesystem. As an added bonus, Consul Template can
execute arbitrary commands when a template update completes.

READMORE

Demo
----
<iframe src="//player.vimeo.com/video/109626825" width="720" height="375" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>


Use Cases
---------
Consul Template can query a service entries, keys, and key values in Consul. The
powerful abstraction and template query language makes Consul Template perfect
for creating dynamic configurations like:

- **Apache/Nginx Proxy Balancers** - It is not uncommon to have multiple
application servers proxied behind a single, public-facing proxy instance. This
configuration usually looks something like:

      <Proxy balancer://frontend>
        BalanceMember 1.2.3.4:80
        BalanceMember 5.6.7.8:80
      </Proxy>

  But adding and removing a node from the load balancer is often a painful,
  time-consuming, and tedious process. Even worse, when a frontend node becomes
  "unhealthy", an operator needs to manually remove it from the load balancer.
  Consul Template makes this entire process trivial:

      <Proxy balancer://frontend>{{range service "app.frontend"}}
        BalanceMember {{.Address}}{{end}}
      </Proxy>

  Here is a similar example for an Nginx configuration:

      upstream frontend { {{range service "app.frontend"}}
        server {{.Address}};{{end}}
      }

  As nodes are added and removed from Consul, they are automatically added and
  removed from the load balancer configuration. Since Consul Template's
  `service` method only queries healthy nodes, unhealthy nodes are also removed
  from the load balancer as soon as they are reported as down. This minimizes
  both downtime and operator intervention so you can focus on what is important!

- **HAProxy Backends** - HAProxy is very common, high-performance load
balancing software. A typical HAProxy configuration file looks like:

      backend frontend
        balance roundrobin
        server web1 web1.yourdomain.com:80 check
        server web2 web2.yourdomain.com:80 check

  However, just like the Apache/Nginx proxy balancer, adding and removing nodes
  from HAProxy is a painful and often scary experience. Consul Template takes
  the fear out of HAProxy:

      backend frontend
        balance roundrobin{{range "app.frontend"}}
        service {{.ID}} {{.Address}}:{{.Port}}{{end}}

  You may notice the `check` attribute has been removed. Since our health checks
  are defined in Consul, and Consul Template only returns healthy nodes from a
  service query, we can save HAProxy the work of checking the nodes health and
  leave that logic to Consul.

  With the optional command argument, Consul Template can automatically trigger
  a reload of HAProxy when the template is updated. As nodes are dynamically
  added and removed from Consul, your load balancer will be immediately informed
  of the change, making it easier than ever to minimize downtime.

- **Varnish Servers** - Varnish is a powerful caching server which supports
querying multiple backends from which to cache data and proxy requests. A
typical Varnish configuration file might look like:

      import directors;

      backend app_01 {
          .host = "1.2.3.4";
          .port = "8080";
      }

      backend app_02 {
          .host = "5.6.7.8";
          .port = "8080";
      }

      sub vcl_init {
          new bar = directors.round_robin()
          bar.add_backend(app_01);
          bar.add_backend(app_02);
      }

      sub vcl_recv {
          set req.backend_hint = bar.backend();
      }

  Just like our HAProxy example, Consul Template makes it trivial to dynamically
  populate and manage Varnish backends:

      import directors;
      {{range service "app.frontend"}}
      backend {{.ID}} {
          .host = "{{.Address}}";
          .port = "{{.Port}}";
      }{{end}}

      sub vcl_init {
          new bar = directors.round_robin()
          {{range service "app.frontend"}}
          bar.add_backend({{.ID}});{{end}}
      }

      sub vcl_recv {
          set req.backend_hint = bar.backend();
      }

- **Application Configurations** - The intuitive yet powerful key-value store
allows application developers and operators to store global configuration
information in Consul. Consul Template will dynamically update when a change
to one of those values occurs. With today's configuration management practices,
it is common to have a configuration template for an application which alter
some tuneable values for the application:

      MaxWorkers 5
      JobsPerSecond 11

  Even using a dynamic configuration management system, the application's
  configuration will remain unchanged until the next run. With Consul Template,
  any change in the key-value store is immediately propagated to all templates
  listening to that value. Now, your configuration management software can write
  a Consul Template:

      MaxWorkers {{key "web/max-workers"}}
      JobsPerSecond {{key "web/jobs-per-second"}}

  This template is now connected with Consul and will receive instant, dynamic
  updates as soon as a change is pushed to Consul. You no longer need to wait
  an hour for the next iteration of your CM system to run.


Features
--------
[Consul Template][] is jam-packed full of great features, but we cannot possibly
list them all! Here are just a few of the many features you will find in
Consul Template:

- **Quiescence** - Consul Template ships with built-in quiescence and can
intelligently wait for changes from a Consul instance. This critical feature
prevents frequent updates to a template while a system is fluctuating.

- **Dry Mode** - Unsure of the current state of your infrastructure? Afraid a
template change might break a subsystem? Fear no more because Consul Template
comes complete with `-dry` mode. In dry mode, Consul Template will render the
result to STDOUT, so an operator can inspect the output and decide if the
template change is safe.

- **CLI _and_ Config** - Do you prefer to specify everything on the command
line? Or are you using a configuration management tool and prefer configurations
written to disk? Whatever your preference, Consul Template has you covered! With
built-in support for [HCL](https://github.com/hashicorp/hcl), Consul Template
accepts a configuration file, command line flags, or a mix of both! In this way,
you can continue to use your existing configuration management tools in tandem
with Consul Template.

- **Verbose Debugging** - Even when you think it is perfect, sometimes systems
fail. For those critical times, Consul Template has a detailed logging system
that can be used to track down almost any issue.


Conclusion
----------
Consul Template has changed the way we think about service discovery in our
infrastructure, and we are very excited to bring this new tool to your
fingertips. Since Consul Template is completely **open source**, you can view
the code or read more about [Consul Template on GitHub][Consul Template]. Please
join me in welcoming our newest member to the Consul family!

[Consul]: https://www.consul.io
[Consul Template]: https://github.com/hashicorp/consul-template
