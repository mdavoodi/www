# -*- mode: ruby -*-
# vi: set ft=ruby :

# Vagrantfile API/syntax version. Don't touch unless you know what you're doing!
VAGRANTFILE_API_VERSION = "2"

$script = <<SCRIPT
sudo apt-get -y update
sudo apt-get -y install curl
gpg --keyserver hkp://keys.gnupg.net --recv-keys D39DC0E3
curl -sSL https://get.rvm.io | bash -s stable
. ~/.bashrc
. ~/.bash_profile
rvm install 2.2.2
rvm --default use 2.2.2
SCRIPT

Vagrant.configure(VAGRANTFILE_API_VERSION) do |config|
  config.vm.box = "hashicorp/precise64"
  config.vm.network "private_network", ip: "33.33.33.10"
  config.vm.network "forwarded_port", guest: "4567", host: "4567"
  config.vm.provision "shell", inline: $script, privileged: false
end
