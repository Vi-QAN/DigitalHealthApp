// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

contract DigitalHealth {
    
    struct Doctor {
        bool authorized;
    }

    struct User {
        address owner;
        bytes32 name;
        bytes32 password;
        bytes32 key;
        mapping(uint8 => Doctor) doctors;
    }

    mapping (address => User) private users;

    uint private id; // Stores user id temporarily

    function stringToBytes32(string memory source) public pure returns (bytes32 result) {
        bytes memory tempEmptyStringTest = bytes(source);
        if (tempEmptyStringTest.length == 0) {
            return 0x0;
        }

        assembly {
            result := mload(add(source, 32))
        }
    }

    // Authentication
    modifier onlyValidName(bytes32 name) {
        // Only valid names allowed

        require(!(name == 0x0));
        _;
    }

    modifier onlyExistingUser() {
        // Check if user exists or terminate

        require(!(users[msg.sender].name == 0x0), "");
        _;
    }

    function login(bytes32 password) view public onlyExistingUser  returns (bytes32 name) {
        if (users[msg.sender].password == password)
            return (users[msg.sender].name);
    }

    function signup(bytes32 name, bytes32 password) public onlyValidName(name) returns (bytes32) {
        // Check if user exists.
        // If yes, return user name.
        // If no, check if name was sent.
        // If yes, create and return user.

        if (users[msg.sender].name == 0x0)
        {
            users[msg.sender].name = name;
            users[msg.sender].password = password;
    	    users[msg.sender].owner = msg.sender; 
            return (users[msg.sender].name);
        }

        return (users[msg.sender].name);
    }

    function update(bytes32 name) public onlyValidName(name) onlyExistingUser returns (bytes32 value) {
        // Update user name.
        if (users[msg.sender].name != 0x0)
        {
            users[msg.sender].name = name;

            return (users[msg.sender].name);
        }
    }
    
    function setKey(address _user, bytes32 _key) public onlyOwner(_user) {
        users[_user].key = _key;
    }

    function getKey(address _user, uint8 _id) public view onlyAuthorizedAccesser(_user, _id) returns(bytes32) {
        return users[_user].key;
    }

    function removeAccesser(address _user, uint8 _id) public onlyOwner(_user) {
        users[_user].doctors[_id].authorized = false;
    }

    function addAccesser(address _user, uint8 _id) public onlyOwner(_user) {
        users[_user].doctors[_id].authorized = true;
    }

    function getAccesser(address _user, uint8 _id) public view onlyOwner(_user) returns (Doctor memory ){
        return users[_user].doctors[_id];
    }

    modifier onlyOwner(address _user) {
        require(msg.sender == users[_user].owner, "Only Owner");
        _;
    }

    modifier onlyAuthorizedAccesser(address _user, uint8 _id){
        if (msg.sender != users[_user].owner){
            require(users[_user].doctors[_id].authorized, "Only Authorized Accessor");
        }
        _;
    }
}