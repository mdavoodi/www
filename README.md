![Mohamicorp](source/images/mohamicorp-black-large.png)

# Mohamicorp.com

This is the repository for the [main Mohamicorp website](http://www.mohamicorp.com).
It was forked off of [Hashicorps website](http://www.hashicorp.com).


This is a [Middleman](http://middlemanapp.com) project, which builds a static
site from these source files. The site is hosted on [Heroku](http://heroku.com)
and then fronted by [Fastly](http://fastly.com).

## Contributions Welcome!

If you find a typo or you feel like you can improve the HTML, CSS, or
JavaScript, we welcome contributions. Feel free to open issues or pull
requests like any normal GitHub project, and we'll merge it in.

## Running the Site Locally

Running the site locally is simple. Clone this repo and run the following
commands:

```
$ bundle
$ bundle exec middleman server
```

Then open up `localhost:4567`. Note that some URLs you may need to append
".html" to make them work (in the navigation and such).

## Stylesheets

We use [Less](http://lesscss.org) to generate site-specific stylesheets along
with [Bootstrap](http://getbootstrap.com). [Grunt](http://gruntjs.com)
is used to create a watcher for changes to the `.less` files.  The
watcher re-compiles the hashicorp.css file when it detects changes in
the .less files.

Assuming you have [npm](http://npmjs.com),
[node.js](http://node.js), and [Less](http://lesscss.org) installed, you can install and run Grunt
and the watcher this way:

```
$ npm install -g grunt-cli
$ npm install
$ grunt
```

## Heroku

To trigger `middleman` static builds on a `git push`, we use this
buildpack:
[https://github.com/hashicorp/heroku-buildpack-middleman](https://github.com/hashicorp/heroku-buildpack-middleman), in addition to the standard Ruby buildback.  Note the example below pushes your local
branch as remote master to trigger build.  To run this on Heroku,
enable multiple buildpacks this way:

```
heroku create
heroku config:add BUILDPACK_URL=https://github.com/ddollar/heroku-buildpack-multi.git
git push heroku <branch>:master
```
