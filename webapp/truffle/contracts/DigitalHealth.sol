// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "./Ownable.sol";

contract DigitalHealth is Ownable {
    
    struct Doctor {
        bool authorized;
    }

    struct User {
        bytes32 name;
        bytes32 email;
        bytes32 password;
        bytes32 key;
        bytes16 iv;
        mapping(address => Doctor) doctors;
    }

    mapping (address => User) private users;

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
        require(!(users[msg.sender].name == 0x0), "User does not exist");
        _;
    }

    modifier onlyAuthenticatedUser(bytes32 password){
        require(users[msg.sender].password == password, 'Only authenticated user');
        _;
    }

    function login(bytes32 password) view public onlyExistingUser returns (bytes32 name) {
        if (users[msg.sender].password == password)
            return (users[msg.sender].name);
        return 0x0;
    }

    function signup(bytes32 name, bytes32 email, bytes32 password) public onlyValidName(name) returns (bytes32) {
        // Check if user exists.
        // If yes, return user name.
        // If no, check if name was sent.
        // If yes, create and return user.

        if (users[msg.sender].name == 0x0)
        {
            users[msg.sender].name = name;
            users[msg.sender].email = email;
            users[msg.sender].password = password;
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
    
    function setKey(address _user, bytes32 _key, bytes16 _iv) public onlyExistingUser onlyOwner {
        users[_user].key = _key;
        users[_user].iv = _iv;
    }

    function getKey(address _user, address accessor) public view onlyOwner onlyAuthorizedAccessor(_user, accessor)  returns(bytes32, bytes16) {
        return (users[_user].key, users[_user].iv);
    }

    // add modifier to check existence of accessor

    function removeAccessor(address accessor, bytes32 password) public onlyExistingUser onlyValidPassword(password) onlyAuthenticatedUser(password) {
        users[msg.sender].doctors[accessor].authorized = false;
    }

    function addAccessor(address accessor, bytes32 password) public onlyExistingUser onlyValidPassword(password) onlyAuthenticatedUser(password) {
        users[msg.sender].doctors[accessor].authorized = true;
    }

    function getAccessor(address _user, address accessor) public view onlyOwner returns (Doctor memory ){
        return users[_user].doctors[accessor];
    }

    modifier onlyAuthorizedAccessor(address _user, address accessor) {
        require(getAccessor(_user, accessor).authorized, "Only Authorized Accessor");
        _;
    }

    modifier onlyValidPassword(bytes32 password){
        require(!(password == 0x0), 'Invalid password');
        _;
    }


}