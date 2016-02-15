# Rakefile
task :build do
  status = system("bundle exec middleman build --clean")
end

task :sync do
  command = "rsync -avze 'ssh -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null' --delete build/ root@162.243.248.50:/www/mohamicorp/build/"
  status  = system command
end

task build_deploy: [:build, :sync]
