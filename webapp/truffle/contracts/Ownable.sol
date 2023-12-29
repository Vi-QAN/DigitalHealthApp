// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

// A library is like a contract with reusable code, which can be called by other contracts.
// Deploying common code can reduce gas costs.
contract Ownable {
  address private owner;

  constructor() {
    owner = msg.sender;
  }

 modifier onlyOwner(){
    require(msg.sender == owner, "Only owner access");
    _;
  }

}
