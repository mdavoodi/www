---
page_title: "HashiCorp + Fastly"
title: "HashiCorp + Fastly"
list_image_url: /images/blog/hashicorp-and-fastly/list.png
post_image_url: /images/blog/hashicorp-and-fastly/post.png
author: Seth Vargo
tags: hashicorp
---

We are very excited to announce our new strategic partnership with [Fastly](https://www.fastly.com?utm_source=hashicorp), one of the most popular modern CDN services. In addition to providing a rock-solid service, they are proponents of open source software, and we are very excited to work with them at HashiCorp.

READMORE

### The Move to Fastly
Before we talk about Fastly, it would be remiss to neglect [JFrog](https://www.jfrog.com?utm_source=hashicorp) – the company behind [Bintray](https://bintray.com) and [Artifactory](https://www.jfrog.com/artifactory/). JFrog has been incredibly gracious in providing a generous free tier on Bintray for hosting the static binaries of our open source products. They have been the backbone of our product distributions, and we cannot thank them enough. If you are in need of an excellent service for distributing binaries with an amazing UI and social features, Bintray is an excellent choice. In addition to providing an excellent service, its support team is very responsive and proactive.

As we have grown in scale, so too have the number of monthly product downloads. At HashiConf, Mitchell announced that our products collectively [had over 6 million downloads in Q3 2015](https://youtu.be/fchJZo2rDSQ?t=439), and those numbers are growing. Tools like [Consul](https://consul.io) and [Nomad](https://nomadproject.io) are often installed on every server in a data center while tools like [Vagrant](https://www.vagrantup.com) and [Otto](https://ottoproject.io) are often installed on every developer's machine or CI server. As our audience has expanded globally, we have looked for how we can improve our experience for all our users. Using a Content Delivery Network (CDN) like Fastly allows us to give the best quality of service to our users, no matter where they are located.

Bintray _does_ offer a tier that provides CDN fronting for binaries, but in our testing we were able to deliver a better experience with Fastly. This is in no way a reflection of the quality of Bintray, it just means that the third-party CDN Bintray uses did not meet our requirements for distribution. Bintray shines as an artifact and metadata repository, but what HashiCorp needs is a globally distributed CDN so that our customers can download software quickly and effectively. We will leave our existing product binaries on Bintray until early 2016, at which point we will shut down the account. _We will not be publishing new product versions to Bintray moving forward._

We began early conversations with a few CDN providers, but it quickly became clear that Fastly was the best choice. Putting aside the amazing technology choices and speed of the service, Fastly was incredibly responsive to our questions. Their support team had sub-hour response times, and they were always willing to help with even the most obscure inquiries.

As of today we store our product binaries in an Amazon S3 bucket and front them with Fastly. Our choice of S3 for backend storage was simply due to our existing experience with AWS technologies. Our choice of Fastly was based off of careful evaluation of multiple competitive CDN services, the main factors being:

- [Fantastic documentation](https://docs.fastly.com/)
- A very friendly support team with incredibly fast answers to our questions
- A robust API for which we could build automation around
- [The ability to upload our own cache configuration (VCL)](https://docs.fastly.com/guides/vcl/uploading-custom-vcl)
- Graceful behavior in the event of a backend failure
- Analytics and custom logging

We agreed on a common folder and product structure (detailed later in this post) and began migrating existing releases from Bintray to our S3 bucket. Throughout this process, we enforced filename consistency, checksums, and GPG signing for all packages before uploading them to the S3 bucket.

Once we agreed on the format for our buckets, we began work on a tool to automate the interaction with both S3 and Fastly, which was made easy since both services are very API-driven. We now have an internal CLI app written in Go that manages:

- Uploading new releases to S3
- Generating the HTML and JSON files for publication
- Performing [soft purges](https://docs.fastly.com/guides/purging/soft-purges) of affected pages

Our S3 bucket is configured to serve content as a static website with our custom content. Fastly is configured to read content out of the S3 origin URL with a cache time of 3600s. As we explored the service more, we discovered that Fastly provided us with some amazing features:

- Content served over modern SSL (TLS 1.2)
- On-the-fly gzipping of our HTML and JSON
- Sending logs to custom service(s) for our own aggregation and analytics
- A real-time usage dashboard that shows information about our hit ratios, error rates, redirects, and more

One of the most exciting features we discovered was Fastly's [shielding](https://docs.fastly.com/guides/performance-tuning/shielding), which designates a cache service to be the point-of-presence for the other cache servers.

![](/images/blog/hashicorp-and-fastly/shielding.png)
![](/images/blog/hashicorp-and-fastly/shielding-future.png)

This reduces the latency experienced on the first read-through to S3 by placing that burden on the POP. In the event of an S3 outage, we have also configured Fastly to continue serving the last-known good content it cached. This greatly improves reliability in the event of downtime or an outage.

In the end, the move of our binaries to Fastly took just under two days. We are still in the process of migrating our static sites and other content, but the releases service is up and running, and we are very excited to share it with you today – [releases.hashicorp.com](https://releases.hashicorp.com/).

### SSL, GPG, and Checksums – Everywhere
Being the company behind the popular open source security tool [Vault](https://vaultproject.io), we care deeply about security. Our users care about security too, and as part of the move to [releases.hashicorp.com](https://releases.hashicorp.com) we have improved our process to increase confidence in the authenticity of our binaries.

The new releases service is only accessible via SSL. If you visit the site over standard HTTP, you will be redirected and forced to HTTPS. Whether you are downloading a release or viewing the JSON API, your requests will be encrypted using TLS 1.2. Additionally, all product versions now include both a `SHA256SUMS` file and a `SHA256SUMS.sig` file that has been signed and can be verified using our [public GPG key](https://www.hashicorp.com/security.html). Our GPG key is stored on a different storage engine, so an attacker would need to compromise multiple systems in order to tamper with the product signatures. If you have any questions, please email <a href="mailto:security@hashicorp.com">security@hashicorp.com</a>.

### Standardizing
The move to Fastly also gave us the opportunity to standardize our URL and file structures for our binaries. All product filenames and URL paths are now _fully predictable and consistent_.  While previously customers had raised concerns over the inconsistent naming of our product ZIP files, moving forward all products will follow the following naming convention:

    PRODUCT_VERSION_OS_ARCH.zip

for example:

    consul_0.6.0_linux_amd64.zip

All products are a ZIP file with maximum compression and compatibility. In the past, some products have been TGZ and some have been ZIP; moving forward, all products will be published in ZIP format with the highly predictable name as shown above. The ZIP format was chosen because it is more compatible with Windows-based environments than the alternatives. In addition to a consistent filename, we have taken steps to increase consistency in the paths where files are stored. The releases service will place all binaries in a hierarchical folder-like pattern as follows:

    releases.hashicorp.com
      \_ PRODUCT/
        \_ VERSION/

These paths are predictable, and we are making a public promise to never change these paths moving forward.

The only exception to this pattern is Vagrant, due to its cross-platform nature. Vagrant is not distributed as a ZIP file and instead includes native OS packages. As a result, the architecture is omitted when irrelevant (universal). When in doubt, you can use the JSON API to query for the full download path.

### JSON API
The new releases service includes a fully-featured JSON API which you can use for easy automation and access to our products and versions. To access the JSON API, simply request the `index.json` version of any folder. The [root index](https://releases.hashicorp.com/index.json) includes a comprehensive list of all our published products, their versions, and a fully-qualified download URL. Here is an excerpt:

    {
      "consul": {
        "name":"consul",
        "versions": {
          "0.1.0": {
            "name":"consul",
            "version":"0.1.0",
            "shasums":"consul_0.1.0_SHA256SUMS",
            "shasums_signature":"consul_0.1.0_SHA256SUMS.sig",
            "builds":[
              {
                "name":"consul",
                "version":"0.1.0",
                "os":"darwin",
                "arch":"amd64",
                "filename":"consul_0.1.0_darwin_amd64.zip",
                "url":"https://releases.hashicorp.com/consul/0.1.0/consul_0.1.0_darwin_amd64.zip"
              },
            ]
          }
        }
      }
    }

As you can see from the output, this output makes it easy to automate downloads from our new releases services. Additionally, you can filter the API at any level. The [metadata information for Otto 0.1.2](https://releases.hashicorp.com/otto/0.1.2/index.json) looks like this:

    // https://releases.hashicorp.com/otto/0.1.2/index.json
    {
      "name":"otto",
      "version":"0.1.2",
      "shasums":"otto_0.1.2_SHA256SUMS",
      "shasums_signature":"otto_0.1.2_SHA256SUMS.sig",
      "builds":[
        {
          "name":"otto",
          "version":"0.1.2",
          "os":"darwin",
          "arch":"386",
          "filename":"otto_0.1.2_darwin_386.zip",
          "url":"https://releases.hashicorp.com/otto/0.1.2/otto_0.1.2_darwin_386.zip"
        },
        {
          "name":"otto",
          "version":"0.1.2",
          "os":"darwin",
          "arch":"amd64",
          "filename":"otto_0.1.2_darwin_amd64.zip",
          "url":"https://releases.hashicorp.com/otto/0.1.2/otto_0.1.2_darwin_amd64.zip"
        },
        // ...
      ]
    }

In fact, the tool we use to publish all our product sites – [middleman-hashicorp](https://github.com/hashicorp/middleman-hashicorp/blob/15cbda0cf1d963fa71292dee921229e7ee618272/lib/middleman-hashicorp/releases.rb) – uses this JSON API to generate the downloadable list of products automatically at build time.

### Looking Forward
We have some exciting things planned with Fastly over the next few quarters, and we will share them with you as them become available. We are confident that as we move our services to be fronted by Fastly that all our users will benefit from the enhanced performance and reliability.
