// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "./Ownable.sol";

contract Authorization is Ownable{
    
    bytes32 key;

    struct Doctor {
        bool authorized;
    }
    
    mapping(uint8 => Doctor) private doctors;

    function stringToBytes32(string memory source) public pure returns (bytes32 result) {
        bytes memory tempEmptyStringTest = bytes(source);
        if (tempEmptyStringTest.length == 0) {
            return 0x0;
        }

        assembly {
            result := mload(add(source, 32))
        }
    } 

    function setKey(bytes32 _key) public onlyOwner {
        key = _key;
    }

    function getKey(uint8 _id) public view onlyAuthorizedAccesser(_id) returns(bytes32) {
        return key;
    }

    function removeAccesser(uint8 _id) public onlyOwner onlyAuthorizedAccesser(_id) {
        doctors[_id].authorized = false;
    }

    function addAccesser(uint8 _id) public onlyOwner {
        doctors[_id].authorized = true;
    }

    function getAccesser(uint8 _id) public view onlyOwner returns (Doctor memory ){
        return doctors[_id];
    }

   

    modifier onlyAuthorizedAccesser(uint8 _id){
        if (msg.sender != owner){
            require(doctors[_id].authorized, "Only Authorized Accessor");
        }
        _;
    }
    
    
}