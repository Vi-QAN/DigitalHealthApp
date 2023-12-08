// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

// A library is like a contract with reusable code, which can be called by other contracts.
// Deploying common code can reduce gas costs.
contract Ownable {
  address payable public owner;

  constructor() {
    owner = payable(msg.sender);
  }

 modifier onlyOwner(){
    require(msg.sender == owner, "Only owner access");
    _;
  }

  function transferOwnership(address newOwner) public onlyOwner {
    if (newOwner != address(0)) owner = payable(newOwner);
  }

}
