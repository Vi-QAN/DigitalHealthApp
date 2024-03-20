// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "./Ownable.sol";

contract DigitalHealth is Ownable {
    
    struct Accessor {
        bool authorized;
    }

    struct User {
        bytes32 name;
        bytes32 email;
        bytes32 password;
        bytes32 key;
        bytes16 iv;
        mapping(address => Accessor) accessors;
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
        require(!(name == 0x0), "Username is empty");
        _;
    }

    modifier onlyExistingAccessor(address user){
        require(!(users[user].name == 0x0), "Accessor does not exist");
        _;
    }

    modifier onlyExistingUser() {
        // Check if user exists or terminate
        require(!(users[msg.sender].name == 0x0), "User does not exist");
        _;
    }

    modifier onlyAuthorizedAccessor(address _user, address accessor) {
        require(getAccessorAuthorization(_user, accessor), "Only Authorized Accessor");
        _;
    }

    modifier onlyValidPassword(bytes32 password){
        require(!(password == 0x0), 'Invalid password');
        _;
    }

    modifier onlyCorrectEmail(bytes32 email){
        require(users[msg.sender].email == email, "Incorrect email");
        _;
    }

    modifier onlyCorrectPassword(bytes32 password){
        require(users[msg.sender].password == password, "Incorrect password");
        _;
    }

    function login(bytes32 email, bytes32 password) public view onlyExistingUser onlyCorrectEmail(email) onlyCorrectPassword(password)  returns (bytes32 name) {
        return (users[msg.sender].name);
    }

    function getUser(address u) public view onlyOwner returns (bytes32 name, bytes32 email, bytes32 password, bytes32 key, bytes16 iv ){
        return (users[u].name, users[u].email, users[u].password, users[u].key, users[u].iv);
    } 

    function signup(bytes32 name, bytes32 email, bytes32 password) public onlyValidName(name) returns (bytes32 username) {
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
    
    function setKey(address _user, bytes32 _key, bytes16 _iv) public onlyOwner {
        users[_user].key = _key;
        users[_user].iv = _iv;
    }

    function getKey(address _user, address accessor) public view onlyOwner onlyAuthorizedAccessor(_user, accessor)  returns(bytes32, bytes16) {
        return (users[_user].key, users[_user].iv);
    }

    // add modifier to check existence of accessor

    function removeAccessor(address accessor, bytes32 password) public onlyExistingAccessor(accessor) onlyValidPassword(password) onlyCorrectPassword(password) {
        users[msg.sender].accessors[accessor].authorized = false;
    }

    function addAccessor(address accessor, bytes32 password) public onlyExistingAccessor(accessor) onlyValidPassword(password) onlyCorrectPassword(password) {
        users[msg.sender].accessors[accessor].authorized = true;
    }

    function getAccessorAuthorization(address _user, address accessor) public view onlyOwner returns (bool authorized){
        if (_user == accessor){
            return true;
        }
        return users[_user].accessors[accessor].authorized;
    }
}