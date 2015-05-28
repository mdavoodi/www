---
page_title: "How Atlas uses Vault for Managing Secrets"
title: "How Atlas uses Vault for Managing Secrets"
list_image_url: "/images/blog/how-atlas-uses-vault-for-managing-secrets/logo.jpg"
post_image_url: "/images/blog/how-atlas-uses-vault-for-managing-secrets/logo.jpg"
tags: atlas, vault
author: Seth Vargo
---

In our previous post on [Atlas GitHub integration](/blog/atlas-terraform-github.html), we mentioned in passing how Vault is used for storing and accessing secrets in Atlas. In this post, we take a deep dive into how Vault is used in Atlas to secure personally identifiable and secure information such as GitHub tokens. This powerful new integration lays the groundwork for some amazing new features that will be coming to Atlas shortly.

Read on to learn more about how Atlas uses Vault to store and manage secret and sensitive information.

READMORE

## Background

Before diving into why we chose Vault for storing secrets in Atlas, it is important to understand existing solutions and why they may not be the best for this use case. To keep the required scope of understanding limited, we will use GitHub OAuth tokens as the example, but many components of Atlas are encrypted using Vault.

When you link Atlas with a GitHub account, GitHub responds with JSON payload. Among the many fields in that payload are some secret pieces of information such as your GitHub username and GitHub OAuth token. You can [read more about OAuth](http://oauth.net/2/) if you are not familiar, but the important point of understanding is that an OAuth token behaves like a password to the external service. In other words, having access to a user's GitHub OAuth token provides the same level of access as the username and password. As such, it is incredibly important to keep this information secure.

In an application that provides username/password authentication, a cryptographic hash function is applied to the plain-text password and the result of that computation is stored in the database during initial user registration. When that user attempts to authenticate with the system, the same cryptographic hash function is applied to the given password and compared with the result in the database. If they match, the user is authenticated. If not, the passwords did not match and authentication fails. Because of the way hashing functions operate, the original password cannot be reconstructed from the hashed values if an attacker were to gain access to the database, and the plain-text password is never persisted in the database.

Unlike passwords, however, we cannot use a one-way hash function to store GitHub OAuth tokens. When Atlas communicates with GitHub, it needs to be able to authenticate requests on your behalf. As such, Atlas needs access to the plain-text GitHub OAuth token at the time it makes a request to GitHub. Since OAuth tokens should be treated like passwords, we cannot store them in plain-text in the database; we must choose a symmetric encryption algorithm. In this scenario, the OAuth token is given to Atlas by GitHub, Atlas encrypts the token using an encryption key only it knows, and then stores the encrypted value in the database. When Atlas needs the plaintext value to communicate with GitHub, it decrypts the data using the same key as before. If an attacker were to gain access to the database, they would only see the encrypted values. But even this approach has some problems.

This approach puts a significant burden of responsibility on the application itself. Atlas would need to be responsible for key management, key rolling, and break-glass procedures. Instead of building this functionality into Atlas directly, we use [Vault](https://vaultproject.io) combined with the [vault-rails](https://github.com/hashicorp/vault-rails) plugin. It should come as no surprise that your Atlas data is encrypted with Vault. We run Vault behind within a private network with very strict access controls.

Vault-rails was designed with developers in mind, and, as such, it integrates seamlessly into existing applications. More detailed installation and setup instructions are available in the [vault-rails README](https://github.com/hashicorp/vault-rails#quick-start), but the changes required to integrate with an existing application are usually as minimal as:

    class MyModel < ActiveRecord::Base
      include Vault::EncryptedModel
      vault_attribute :secure_field
    end

In this example, the vault-rails plugin creates a virtual attribute for `secure_field`. When new values are set, they are encrypted with Vault and the encrypted values are stored in the database. When the virtual attribute is requested, the application provides Vault with the encrypted text and gets back the plaintext (if authorized). Most importantly, this all happens transparently to the developers. Developers do not need to be aware of Vault or its configuration, they simply write the same application code they usually do:

    my = MyModel.new
    my.secure_field = "s3cRet"
    my.secure_field #=> "s3cRet"

With the help of the vault-rails plugin, Atlas delegates the encryption and decryption to our internal Vault server using Vault's [transit backend](https://vaultproject.io/docs/secrets/transit/). The transit backend is a transparent encryption-decryption endpoint in vault.

![Animation showing how data is encrypted in Atlas with Vault](/images/blog/how-atlas-uses-vault-for-managing-secrets/animated.gif)

How is this different than having Atlas encrypt the data? First, we are delegating the encryption and decryption responsibility to a service that was designed for storing secrets. Vault has first-class support for audit logging, key and access revocation, well defined break-glass procedures, and will soon have support for key rolling. Vault is a specialized product for managing secrets.

Second, we increase the number of systems an attacker must compromise in order to decrypt the data. If Atlas were responsible for the encryption, it would need to know the encryption key. This key would probably stored somewhere on disk or in memory. If an attacker gained access to the application, they could dump that encryption key in addition to all the encrypted database values.

By moving the encryption into Vault, **Atlas never knows the encryption or decryption keys**. Instead, Atlas is authorized to communicate with Vault with its token. The token provides limited access to Vault and can be revoked at any time. If there is suspicion of an intrusion, the token can be revoked or the Vault can be sealed. Thus, even if an attacker is able to compromise all of Atlas, they would still need to compromise Vault to be able to decrypt the encrypted database values. As an added bonus, each column of each database table is encrypted with a _different_ key, making a potential compromise much more complex.

## The Future

Vault is a rapidly evolving product, but already provides a solution to secret management and storage of PII data. It provides a secure foundation to build upon, and vault-rails is an example of using Vault in a developer friendly way. We will update Atlas and the vault-rails plugin as we add new features to Vault.

At HashiCorp, we build open source tools that transform the way organizations manage and monitor the modern datacenter. This places immense responsibility on HashiCorp to securely perform datacenter operations on our customers behalf, thus making security a first-class concern. To report security vulnerabilities or concerns, please email security@hashicorp.com.
