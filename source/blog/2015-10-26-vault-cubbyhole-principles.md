---
page_title: "Cubbyhole Authentication Principles"
title: "Vault: Cubbyhole Authentication Principles"
list_image_url: "/images/blog/vault/list.png"
post_image_url: "/images/blog/vault/header.png"
tags: vault
author: Jeff Mitchell
---

In the [Vault 0.3 release post](https://hashicorp.com/blog/vault-0.3.html), the
[`cubbyhole`
backend](https://vaultproject.io/docs/secrets/cubbyhole/index.html) was
introduced, along with an example workflow showing how it can be used for
secure authentication to Vault. Here at HashiCorp, we believe that
Cubbyhole-based authentication is the best approach for authenticating to
Vault in a wide variety of use-cases. In this post we will explain why
Cubbyhole may be the right authentication model for you, and present multiple
considerations around Cubbyhole authentication to help fit a number of
real-world deployment scenarios.

This post will first explain the motivation behind developing the Cubbyhole
authentication model, then describe the model itself, and finally present
some considerations for designing deployment scenarios.

READMORE

## Why Cubbyhole?

In Vault, there are two main types of authentication backends available:

1. User-oriented authentication backends: These generally rely on knowledge of
   a shared secret, such as a password for `userpass` and `ldap` or a GitHub
   API token for `github`. This shared knowledge is distributed out-of-band.
2. Machine-oriented authentication backends: These rely on some intrinsic
   property of the client (such as a machine MAC address for `app-id`) or a
   secret distributed out-of-band (such as a TLS private key/certificate for
   `cert`) in order to facilitate automatic authentication of machines and
   applications.

User-oriented backends are fairly straightforward and well understood, as they
map to authentication paradigms used by many other systems.

However, machine-oriented authentication is more difficult in any circumstance,
and Vault is no exception:

* Many intrinsic properties of a machine are discoverable by other machines.
  For instance, the `app-id` backend relies on a machine knowing some unique
  property of itself as one of the shared secrets. The given suggestion is to
  use the MAC address of a machine as a unique machine property, or a hash of
  it with some salt. Without a salted hash, the MAC address is discoverable to
  any other machine on the subnet. If you are using a salted hash, you need a
  secure way to distribute the shared salt value to the machine, placing you
  into an out-of-band secret distribution scenario (see below). Choosing a
  value that is not discoverable to other machines often means that it is not
  easily discoverable to the process populating `app-id` either, again resulting
  in an out-of-band secret distribution problem.
* Out-of-band distribution relies on having a secure channel to a machine. If
  such a secure channel exists, for instance to distribute a private key for a
  certificate to allow a client to use `cert` authentication, it may as well be
  used to distribute a Vault token. There are additional complications when you
  want to use Vault itself to establish the secure channel, such as using the
  `pki` backend to issue client/server TLS certificates to enable further
  secure communications.
* Both kinds of secrets are vulnerable to operator snooping. For instance,
  using `app-id` as an example once again:
  * The MAC address of a machine (an intrinsic property) is almost certainly
    known to operators.
  * The other half of `app-id` authentication is a unique UUID for the machine
    (an out-of-band distributed secret), suggested to be stored in
    configuration management. However, storing this value in configuration
    management often means that it is stored in plaintext on-disk (likely in
    many places if using a DVCS to version configuration management
    information, as is very common). Even if it is encrypted on-disk (as most
    configuration management utilities are able to do), any operator or service
    that is used to deploy to a machine must know the decryption key, which
    itself is a secret that must now be protected and securely distributed.

There is no perfect answer to automatic secret distribution, which in turn
means that there is no perfect answer to automatic machine authentication.
However, risk and exposure can be minimized, and the difficulty of successfully
using a stolen secret can be heightened. Using the `cubbyhole` backend along
with some of Vault's advanced token properties enables an authentication model
that is in many cases significantly more secure than other methods both within
Vault and when compared to other systems. This in turns enhances Vault's
utility as an access control system to secrets stored both within Vault itself
and other systems (such as
[MySQL](https://vaultproject.io/docs/secrets/mysql/index.html) or
[PostgreSQL](https://vaultproject.io/docs/secrets/postgresql/index.html) or
[Cassandra](https://vaultproject.io/docs/secrets/cassandra/index.html)), or
even for directly accessing other systems (for instance, via
[SSH](https://vaultproject.io/docs/secrets/ssh/index.html) or [TLS
certificates](https://vaultproject.io/docs/secrets/pki/index.html)).

## The Cubbyhole Authentication Model 

As a quick refresher, the `cubbyhole` backend is a simple filesystem
abstraction similar to the `generic` backend (which is mounted by default at
`secret/`) with one important twist: the entire filesystem is scoped to a
single token and is completely inaccessible to any other token.

Since many users are using Vault secrets to establish secure channels to other
machines, we wanted to develop an authentication model that itself does not
rely on a secure channel (but of course can be enhanced by a secure channel).

Instead, the model takes advantage of some of the security primitives available
with Vault tokens and the Cubbyhole backend:

* Limited uses: tokens can be valid for only a certain number of operations
* Limited duration: tokens can be revoked after a configurable duration
* Limited access: only a single token can be used to set or retrieve values in
  its cubbyhole

Using these primitives, and with input and feedback from security experts both
in the field and at several commercial companies, we constructed a new
authentication model. Like all authentication models, it cannot guarantee
perfect security, but it sports a number of desirable properties.

The model works as follows, supposing that we are trying to get a Vault token
to an application (which could be a machine or container or VM instead):

1. A process responsible for creating Vault authentication tokens creates two
   tokens: a permanent (`perm`) token and a temporary (`temp`) token. The
   `perm` token contains the final set of policies desired for the application
   in the container. The `temp` token has a short lease duration (e.g. 15
   seconds) and a maximum use count of 2.
2. The `temp` token is used to write the `perm` token into the cubbyhole
   storage specific to `temp`. This requires a single write operation, reducing
   the remaining uses of `temp` to one.
3. The invoked process gives the `temp` token to the application management
   engine (for instance, Docker), which starts the application and injects the
   `temp` token value into the application environment.
4. The application reads the `temp` token from the environment and uses it to
   fetch the `perm` token from the cubbyhole. This read operation exhausts the
   `temp` token's use limit, the `temp` token is revoked, and its cubbyhole is
   destroyed.

Let's take a look at some of the properties of this method:

* Even if the value of the `temp` token is passed in cleartext to a process,
  the value of the `perm` token will be (should be!) covered by TLS.
* The value of the `temp` token is useless after it has either expired or been
  revoked, and outside of the target application's memory, the value of the
  `perm` token is lost forever at that point because the `temp` token's
  cubbyhole is destroyed. Accordingly:
  * A `temp` token written to disk in order to pass it to an application
    presents no long-term security threat.
  * If the value is logged (for instance, because it was handed to a container
    in its environment variable settings), the value in the log presents no
    long-term security threat.
* Accesses by bad actors are detectable, because the application will be
  unable to use the `temp` token to fetch the `perm` token, at which point it
  can raise an alert.
  * Because accesses to the cubbyhole are logged in Vault's audit log, an
    operator can then use the audit log to discover whether an application
    took too long to start (only one instance of the cubbyhole being accessed
    will appear in the audit logs before revocation) or whether another process
    used the token (two instances will appear in the audit logs) to steal the
    `perm` token.

Of course, depending on the particular setup, there is still the potential for
malfeasance, but there are also mitigations:

 * If the disclosure of the `temp` token to the application happens over an
   insecure channel, it may be subject to sniffing.
   * Some of the considerations detailed in the next section provide defense
     against this.
   * If the sniffer actually fetches the value of the `perm` token, this is
     detectable.
 * If an operator or another machine is able to intercept the `temp` token
   value while it is still valid (for instance, by reading an application's
   environment immediately after startup, or if logs containing the
   environment are available within the `temp` token's time-to-live),
   they can use this to retrieve the value of the `perm` token.
   * This is detectable as well.

No authentication mechanism is perfect. However, limited uses, limited
duration, and limited access together form a powerful set of security
primitives. The ability to detect accesses by bad actors is also an extremely
important property. By combining them, the Cubbyhole authentication model
provides a way to authenticate to Vault that likely meets the needs of even the
most stringent security departments.

## Cubbyhole Authentication Considerations

A natural question at this point is "who or what is responsible for creating
the `temp` and `perm` tokens?" Because this authentication workflow is simply a
model, there isn't a single structured way to use it. The flip side, however,
is that there is a lot of flexibility to easily craft the solution that meets
your needs.

This section will present a few considerations targeted to different
deployment and operation models. They are not exhaustive, but should provide
ideas for implementing Cubbyhole authentication in your own Vault deployment.

### Pushing, Pulling, and Callbacks

In a normal push model, tokens are generated and pushed into an application,
its container, or its virtual machine, usually upon startup. A common example
of this would be generating the `temp` and `perm` tokens and placing the `temp`
token into a container's environment.

This is a convenient approach, but has some drawbacks:

* Environment information is often logged at application or container startup,
  and may be accessible by others within a short time frame.
* It may be difficult or impossible to configure the application launcher or
  management system to perform this functionality, especially without writing a
  framework, executor, or other large chunk of code.
* If an application fails and it (or its container) is restarted, it may see an
  out-of-date `temp` token in its environment.

In a pull model, the application, upon startup, reaches out to a
token-providing service to fetch a `temp` token. Alternately, rather than
coding this logic into each application or container, a small boostrapping
application could perform this task, then start the final application and pass
the value of the `perm` token in. The same bootstrapping application could be
used across machines or containers.

The pull model provides some benefits:

* It requires constructing a simple token providing service rather than
  potentially modifying an application scheduling system.
* If an application fails and it (or its container) is restarted, it can pull
  another token in rather than seeing an out-of-date `temp` token in its
  environment.

However, there is a major drawback to the pull model as well: it requires a
token providing service to implement some logic and heuristics to determine
whether a request is valid. For instance, upon receiving a request from a
specific IP and with a specified application, it could check with the
application or container scheduler to determine if, in fact, that application
was just spun up on that node. This may not work well if the application has a
runtime manager that restarts it locally if it fails.

If coding some Vault logic into each application is possible, one way to
mitigate this is a callback approach: applications can implement a known
endpoint, and upon startup -- whether initially or due to a restart after a
failure -- an application can provide its ID (and possibly other values, such
as its host) and ask the token-providing service to provide a token to its
callback endpoint.

The benefit here is that the token-providing service does not need to trust
that the calling application is what it says it is -- it sends the token to the
known good location of the application. If that application did not request a
new token, it can send an alert to trigger an investigation.

### Host-based vs. Network-based

The above section makes an assumption that there is a networked application
management system or a centralized token-providing service. However, in many
cases each host may be given a token and be responsible for creating
sub-tokens. For instance, rather than have a known endpoint in each
application, each machine could utilize the callback method described above by
running a small daemon that can be contacted on a specific port by the
token-providing service; once retrieved, the token could be stored in a secure
location on the host (such as a memory-locked ramdisk or normal ramdisk with
random-key encrypted swap) with appropriate filesystem permissions. The host's
token could then be used to generate tokens for other applications and services
running on the host.

When the host itself is handing out the `temp` tokens, several additional
options become viable for applications. Some examples:

* If the application is running in a container, the host could write the token
  to a directory on the host file system created specifically for that
  container and bind-mount it into the container upon startup.
* If the application is running in a chroot, the host could write the token
  into the chroot before application startup.

Generally in these scenarios, application or container startup would require a
pre-start command to generate a token pair and receive the `temp` token to pass
to the application. (In most cases supervisors or init daemons responsible for
application startup run as privileged users, so this can be done safely before
starting the final application with reduced or dropped privileges). Depending
on how the application is started, this may mean a wrapper around Docker CLI
calls, an extra line(s) in the application's init/startup script, or other
methods.

An advantage of this approach is that the host daemon could be responsible for
generating tokens at predictable intervals and storing them into the
appropriate file system location, whether in a Docker container, chroot, or
simply a directory with appropriate access permissions. Then the application
only needs to implement a simple watch on the file to see if it has been
updated, and to fetch its new Vault token when that happens.

## Share the Knowledge

We think that the Cubbyhole authentication model will be extremely useful to
many organizations. We hope that as our users deploy their authentication
solutions based on Cubbyhole, they will provide feedback, tips, and useful code
to the community. Please be sure to spread the knowledge around on the [vault-tool
mailing list](https://groups.google.com/forum/#!forum/vault-tool)!
