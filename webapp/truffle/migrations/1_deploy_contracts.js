const DigitalHealth = artifacts.require("DigitalHealth");
const Ownable = artifacts.require('Ownable');

module.exports = function(deployer) {
  deployer.deploy(Ownable);
  deployer.link(Ownable, DigitalHealth);
  deployer.deploy(DigitalHealth);
};
