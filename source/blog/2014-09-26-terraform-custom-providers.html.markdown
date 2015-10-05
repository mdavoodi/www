---
page_title: "Writing Custom Terraform Providers"
title: "Writing Custom Terraform Providers"
list_image_url: "/images/blog/terraform/small.png"
post_image_url: "/images/blog/terraform/big.png"
tags: terraform
author: Mitchell Hashimoto
---

Custom providers in Terraform let you use Terraform to build and
manage new infrastructure components. These custom providers can be written
for public components (such as a new SaaS provider) or private
components (such as a private cloud). In this blog post, we'll show you
how easy it is to write a complete custom provider.

With the release of [Terraform 0.2](/blog/terraform-0-2.html), we made
writing custom providers incredibly easy by introducing a framework that
eliminates almost all the boilerplate of writing Terraform providers.

Using this new framework, we wrote a complete
[Google Compute provider](http://www.terraform.io/docs/providers/google/index.html)
in less than 8 hours of coding time. In this blog post, we'll write a dummy
provider that doesn't talk to a real system, but shows you how easy it is
to implement a custom provider in Terraform.

READMORE

## Project Setup

Terraform plugins are [Go](http://golang.org) binaries, so we'll need
a development environment for Go. Make sure you have Go properly installed,
then create a folder to work in somewhere. Open a terminal to this directory.

For the remainder of this post, we'll assume you have basic Go knowledge.
You don't need be an expert at Go. By completing the
[Tour of Go](http://tour.golang.org/), you'll be proficient enough
in Go to write a Terraform plugin.

If at any time during the post you want to see a more realistic example
of a provider, we recommend keeping the source for the
[built-in providers](https://github.com/hashicorp/terraform/tree/master/builtin/providers)
open in a tab. A good starting point there is the Heroku provider.

## The Provider Schema

To start, create a file `provider.go`. In this file, write the following
contents. This will setup the base boilerplate we need to get going.
We'll cover details about what everything is doing below the
code.

<pre class="prettyprint">
package main

import (
	"github.com/hashicorp/terraform/helper/schema"
)

func Provider() *schema.Provider {
	return &schema.Provider{
		ResourcesMap: map[string]*schema.Resource{},
	}
}
</pre>

The `helper/schema` library within the Terraform project is the framework
we'll use throughout this process. In the file above, we've simply defined
an empty provider.

The `*schema.Provider` type is the basic structure that describes a
provider: the configuration keys it takes, the resources it supports,
a callback to configure, etc. We haven't yet defined any of these components
except for an empty mapping of resources, but we'll get there.

## Building the Empty Plugin

Next, create a file `main.go` with the following contents:

<pre class="prettyprint">
package main

import (
	"github.com/hashicorp/terraform/plugin"
)

func main() {
	plugin.Serve(&plugin.ServeOpts{
		ProviderFunc: func() terraform.ResourceProvider {
			return Provider()
		},
	})
}
</pre>

This sets up our `main` function so that this is a valid Go binary.
The contents of the main function uses the `plugin` library within
Terraform. This library knows how to serve a plugin and handles all the
details of communicating with the main Terraform application.

Build it using `go`:

<pre class="prettyprint">
$ go build -o terraform-provider-dummy
...
</pre>

The output name (the `-o` flag) is **very important**. Terraform looks
for plugins in the format of `terraform-TYPE-NAME` to autoload plugins.
In this case, our plugin is a "provider" type named "dummy."

If you run the binary, you can see we've build a Terraform plugin!

<pre class="prettyprint">
$ ./terraform-provider-dummy
This binary is a Terraform plugin. These are not meant to be
executed directly. Please execute `terraform`, which will load
any plugins automatically.
</pre>

We now have all the project structure in place, so its time to make the
provider do something.

## Your First Resource Schema

Providers in Terraform manage _resources_. A provider can support multiple
resource types. As an example, the AWS provider supports `aws_instance`,
`aws_elastic_ip`, etc. Let's now create our first resource, the
`dummy_server` type!

Create the file `resource_server.go`. As a general convention, Terraform
providers put a single resource in each file. This is not necessary, but
is a nice way to organize providers.

<pre class="prettyprint">
package main

import (
	"github.com/hashicorp/terraform/helper/schema"
)

func resourceServer() *schema.Resource {
	return &schema.Resource{
		Create: resourceServerCreate,
		Read:   resourceServerRead,
		Update: resourceServerUpdate,
		Delete: resourceServerDelete,

		Schema: map[string]*schema.Schema{
			"address": &schema.Schema{
				Type:     schema.TypeString,
				Required: true,
			},
		},
	}
}
</pre>

This uses the `*schema.Resource` type. This structure defines the
data schema and CRUD operations for a resource. This is all that is needed
to create a resource.

We've defined a basic schema for our server resource. The schema has
one element "address" which is a required string. Terraform uses the
schema to enforce validation and types for configuration.

Next, we've defined four fields: `Create`, `Read`, `Update`, and `Delete`.
These four functions are all that need to be implemented for a resource
to be functional. Terraform itself handles which function needs to be
called and with what data. Based on the schema and the current state
of the resource, Terraform can determine whether it needs to create a new
resource, update an existing one, destroy an existing one, etc.

For now, let's just implement empty functions for these.
Put the functions below in the same file:

<pre class="prettyprint">
func resourceServerCreate(d *schema.ResourceData, m interface{}) error {
	return nil
}

func resourceServerRead(d *schema.ResourceData, m interface{}) error {
	return nil
}

func resourceServerUpdate(d *schema.ResourceData, m interface{}) error {
	return nil
}

func resourceServerDelete(d *schema.ResourceData, m interface{}) error {
	return nil
}
</pre>

Finally, we need to update our provider schema in `provider.go` to
tell our provider about the new resource that we support. Change the
Provider function to be the following:

<pre class="prettyprint">
func Provider() *schema.Provider {
	return &schema.Provider{
		ResourcesMap: map[string]*schema.Resource{
			"dummy_server": resourceServer(),
		},
	}
}
</pre>

Test that this compiles by running `go build -o terraform-provider-dummy`.
Everything should compile. Next, we'll actually use this empty provider!

## Using the Provider

It is time to use the provider. We know it doesn't actually do anything
useful yet, but we should have enough in place that Terraform gives the basic
illusion that something might happen.

Make sure your terminal is in the directory with the provider we've been
making. Terraform requires that the binary we've been compiling be in the
working directory to be auto-discovered.

<div class="alert alert-block alert-info">
<strong>NOTE:</strong> Terraform 0.2.2 is supposed to be able to load
plugins from the working directory, but has a bug preventing it from doing
so. If you're on this version or earlier, run the command below to copy
the plugin to the same directory as Terraform. This will allow Terraform
plugin auto-discovery to work properly. You'll have to do this
after every compile. The command:
<code>
cp ./terraform-provider-dummy  $(dirname `which terraform`)
</code>
</div>

Next, make a `test.tf` file:

<pre class="prettyprint">
resource "dummy_server" "foo" {}
</pre>

And run `terraform plan`:

<pre class="prettyprint">
$ terraform plan
There are warnings and/or errors related to your configuration. Please
fix these before continuing.

Errors:

  * 'dummy_server.foo' error: address: required field is not set
</pre>

Cool! We failed a configuration validation. This shows that our plugin
is being loaded and that our resource is properly validating. Let's fix
our validation issue by adding a value for address, then run plan again:

<pre class="prettyprint">
$ terraform plan
...

+ dummy_server.foo
    address: "" => "hashicorp.com"
</pre>

It worked! Terraform properly determined the changing attributes, and
detected that we'll be creating a new server.

You can run `terraform apply` (which will succeed), but you'll notice
that `plan` still says it needs to be created. This is because we didn't
actually implement the `Create` callback properly above. We'll start
doing that next.

## Implementing Create

Let's go back to `resource_server.go` and implement the create function.
Copy the contents below and we'll explain after.

<pre class="prettyprint">
func resourceServerCreate(d *schema.ResourceData, m interface{}) error {
	address := d.Get("address").(string)
	d.SetId(address + "!")
	return nil
}
</pre>

This uses the
[schema.ResourceData API](http://godoc.org/github.com/hashicorp/terraform/helper/schema#ResourceData)
to get the value of our "address" configuration. Note that due to the way
Go works, we have to typecast it to string. This is a safe operation, however,
since our schema guarantees it will be a string type.

Next, it uses `SetId` to set the ID of the resource to the address with
an exclamation point. The existence of a non-blank ID is what tells Terraform
that a resource was created. This ID can be any string value, but should be
a value that can be used on its own to look up the resource again.

Now, recompile, run `terraform apply` again, then run `terraform plan`.
You should see the following:

<pre class="prettyprint">
$ terraform apply
...

Apply complete! Resources: 1 added, 0 changed, 0 destroyed.

$ terraform plan
...

No changes.
</pre>

Whoa! Hey! Because we now set the ID, Terraform believes that the resource
was successfully created, so when we run `plan` right away again, Terraform
properly determines there are no changes to apply.

If you change the value of "address" and run `plan` again, you'll see
the following:

<pre class="prettyprint">
$ terraform plan
...

~ dummy_server.foo
    address: "hashicorp.com" => "mitchellh.com"
</pre>

Terraform picks up the change, and this time the diff is shown with a "~"
prefix, noting that the resource will be modified, rather than created anew.

If you run `terraform apply`, it'll succeed. If you run `terraform plan`
again, then Terraform will tell us there are no changes! But wait, we didn't
implement an update function (that does something). How did this possibly work?

It's time to talk about error handling in providers, and its affect on
create/update/destroy.

## Error Handling and Partial State

At the end of the prior section, our update operation succeeded and persisted
the new state without us actually implementing the function. Recall the update
function we wrote:

<pre class="prettyprint">
func resourceServerUpdate(d *schema.ResourceData, m interface{}) error {
	return nil
}
</pre>

That final `return nil` is telling Terraform that the update succeeded without
error. Terraform assumes that this means any changes requested in the state
have been applied. Because of this, our state was updated and Terraform
believes we have no further changes.

To say it another way: if a callback returns no error, Terraform automatically
assumes the entire diff was successfully applied, merges the diff into
the final state, and persists it.

In reality, it is a bit more complicated than this. Imagine the scenario where
our update function has to update two separate fields which require two separate
API calls. What do we do if the first API call succeeds but the second fails?
How do we properly tell Terraform to only persist half the diff?
This is known as a _partial state_ scenario, and implementing these properly
is critical to a well-behaving provider.

Before going further, let me list the exact rules for state updating in
Terraform. Note that this mentions callbacks we haven't touched yet, for
the sake of completeness.

* If the `Create` callback returns with or without an error without an ID
  set using `SetId`, the resource is assumed to not be created, and no state
  is saved.

* If the `Create` callback returns with or without an error and an ID has
  been set, the resource is assumed created and all state is saved with it.
  Repeating because it is important: if there is an error, but the ID is set,
  the state is fully saved.

* If the `Update` callback returns with or without an error, the full state
  is saved. If the ID becomes blank, the resource is destroyed (even within
  an update, though this shouldn't happen except in error scenarios).

* If the `Destroy` callback returns without an error, the resource is assumed
  to be destroyed, and all state is removed.

* If the `Destroy` callback returns with an error, the resource is assumed
  to still exist, and all prior state is preserved.

* If partial mode (covered next) is enabled when a create or update returns, only
  the explicitly enabled configuration keys are persisted, resulting in
  a partial state.

**Partial mode** is a mode that can be enabled by a callback that tells
Terraform that it is possible for partial state to occur. When this mode is
enabled, the provider must explicitly tell Terraform what is safe to
persist and what isn't.

An example of partial mode within an update function is shown below:

<pre class="prettyprint">
func resourceServerUpdate(d *schema.ResourceData, m interface{}) error {
    // Enable partial state mode
    d.Partial(true)

    if d.HasChange("address") {
        // Try updating the address
        if err := updateAddress(d, meta); err != nil {
            return err
        }

        d.SetPartial("address")
    }

    // If we were to return here, before disabling partial mode below,
    // then only the "address" field would be saved.

    // We succeeded, disable partial mode. This causes Terraform to save
    // save all fields again.
    d.Partial(false)

    return nil
}
</pre>

Note that this code won't compile since we haven't implemented the
`updateAddress` function. You can implement a dummy version of this function
to play around with partial state, if you want to see it in action. Otherwise,
the comments above explain what is going on.

Note that for our example, partial state doesn't mean much since we only
have one field ("address"), but even with the above, if `updateAddress`
were to fail, then the address field would not be persisted. As a result,
a `terraform plan` would say that the update still needs to be run.

Next, let's get back to our provider and talk about the other callbacks.

## Implementing Destroy

The `Destroy` callback is exactly what it sounds like: it is called to
destroy the resource. This should not update any state on the resource.
It isn't necessary to call `d.SetId("")` since any non-error return value
assumes that the resource was deleted successfully.

The destroy function should handle the case where the resource might
already be destroyed (manually, for example). This should not return an
error. This allows users of Terraform to manually delete resources without
Terraform breaking.

You can see destroy work by planning a destroy and applying:

<pre class="prettyprint">
$ terraform plan -destroy -out=tf.plan
...

- dummy_server.foo

$ terraform apply tf.plan
...

Apply complete! Resources: 0 added, 0 changed, 1 destroyed.
</pre>

## Implementing Read

The `Read` callback is used to sync the local state with the remote (actual)
state. This is called at various points by Terraform. This should be a
read-only operation and should _not_ change the real resource in any way.

If the ID is updated here to be blank (`d.SetId("")`), this tells Terraform
the resource has been destroyed. Just like the destroy callback, the `Read`
function should gracefully handle the case that the resource may no longer
exist.

## Success! Next Steps

Congratulations! You've successfully implemented a very basic provider for
Terraform. Hopefully you can imagine filling in our CRUD operations with
actual API calls to some remote service in order to make our provider do
something real.

This blog post only covered the surface of what is possible with the
Terraform provider framework ("helper/schema"), but you're now equipped
with the knowledge necessary to easily discover the rest. We'll cover
advanced provider writing techniques in a follow-up blog post, as well.

As next steps, you should reference the
[built-in providers](https://github.com/hashicorp/terraform/tree/master/builtin/providers)
in Terraform as good examples. Note that not all providers use the
"helper/schema" framework which was recently introduced. If a provider/resource
isn't using this framework, you should ignore it and look at another.

We've purposely made creating providers as easy as possible to enable
anyone/everyone to augment Terraform to support the various systems that
are needed to run our applications. Hopefully, this blog post showed you
just how easy this can be. Email us and tell us about any providers you create!
