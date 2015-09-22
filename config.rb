page "/feed.xml", :layout => false

set :css_dir, 'stylesheets'
set :js_dir, 'javascripts'
set :images_dir, 'images'

# Set the timezone so that blog posts so the correct publish time
# or whatever.
Time.zone = "America/Los_Angeles"

# Blogging
activate :blog do |blog|
  blog.layout = "layouts/blog_post"
  blog.permalink = ":title.html"
  blog.prefix = "blog"
  blog.tag_template = "tag_template.html"

  blog.paginate = true
  blog.per_page = 5
end

sprockets.append_path 'files/'

# Build-specific configuration
configure :build do
  activate :asset_hash, ignore: [
    "images/products-sprite.png",
    "images/products-sprite@2x.png",
  ]
  activate :minify_html, remove_http_protocol: false
  activate :minify_javascript

  # Enable cache buster
  # activate :cache_buster

  # Use relative URLs
  # activate :relative_assets

  # Compress PNGs after build
  # First: gem install middleman-smusher
  # require "middleman-smusher"
  # activate :smusher

  # Or use a different image path
  # set :http_path, "/Content/images/"
end
