const DigitalHealth = artifacts.require("../contracts/DigitalHealth.sol");

async function stringToBytes32(str) {
    try {
        // Dynamically import web3
        const { default: Web3 } = await import('web3');
        
        // Initialize web3
        const web3 = new Web3("http://127.0.0.1:8545");

        // Convert string to bytes32
        let hexString = web3.utils.asciiToHex(str);
        let hexStringLength = hexString.length - 2; // Exclude '0x' prefix
        let paddedHexString = hexString.padEnd(66, '0'); // 32 bytes * 2 characters/byte + '0x' prefix

        return paddedHexString;
    } catch (error) {
        console.error('Error importing web3:', error);
        return null;
    }
}


contract("Digital Health Contract Test Cases", ([contractOwner, secondAddress, thirdAddress, forthAddress]) => {
    const name  = "0xb2840da3ac4e2057915102bc9dc97c336fbf2701c5444522e3490383f524db59";
    const key = "0xa454f7cadf32b26588f51a41e6400ce3fc4b93314e33538b941e301cbab4afd6";
    const iv = "0x148309dc448981aa3c5ba80978d436a5"

    let contract;
    let username1, email1, password1;
    let username2, email2, password2;

    // this would attach the deployed smart contract and its methods 
    // to the `truffleTutorial` variable before all other tests are run
    before(async () => {
        contract = await DigitalHealth.deployed();
        username1 = await stringToBytes32("Test user 1");
        email1 = await stringToBytes32("123@gmail.com");
        password1 = await stringToBytes32("123");

        username2 = await stringToBytes32("Test user 2");
        email2 = await stringToBytes32("456@gmail.com");
        password2 = await stringToBytes32("456");
    })

    // check if deployment goes smooth
    describe('deployment', () => {
        // check if the smart contract is deployed 
        // by checking the address of the smart contract
        it('deploys successfully', async () => {
            const address = await contract.address
            assert.notEqual(address, '')
            assert.notEqual(address, undefined)
            assert.notEqual(address, null)
            assert.notEqual(address, 0x0)
        })
    })

    describe('authentication', () => {
        // check if owner can set new message, check if setMessage works
        it("Should be able to sign up", async function() {
            const result = await contract.signup(username1, email1, password1, {from: secondAddress});

            const user = await contract.getUser(secondAddress, {from: contractOwner});

            assert.notEqual(result,null,'Cannot sign up');
            assert.equal(user.name, username1);
            assert.equal(user.email, email1);
            assert.equal(user.password, password1);
        })

        it("Should not be able to sign up", async function() {
            try {
                await contract.signup("0x0", email1, password1, {from: secondAddress});
                assert.fail("Function should have reverted"); // Fail the test if it didn't revert
              } catch (error) {
                // Check if the error message matches the expected revert reason
                assert.include(
                  error.message,
                  "revert",
                  "Username is empty"
                );
              }
        });
    
        // make sure only owner can setMessage and no one else
        it("Should be able to login", async function() {
            const result = await contract.login(email1, password1, {from: secondAddress});
            assert.equal(result,username1,'Cannot login');
        })

        it("Non existing users should not be able to login ", async function() {
            try {
                await contract.login(email1, password1, {from: thirdAddress});
                assert.fail("Function should have reverted"); // Fail the test if it didn't revert
              } catch (error) {
                // Check if the error message matches the expected revert reason
                assert.include(
                  error.message,
                  "revert",
                  "User does not exist"
                );
              }
        });

        it("Wrong password or email should not be able to login", async function() {
            try {
                await contract.login(email2, password1, {from: secondAddress});
                assert.fail("Function should have reverted"); // Fail the test if it didn't revert
            } catch (error) {
                // Check if the error message matches the expected revert reason
                assert.include(
                  error.message,
                  "revert",
                  "Incorrect email"
                );
            }

            try {
                await contract.login(email1, password2, {from: secondAddress});
                assert.fail("Function should have reverted"); // Fail the test if it didn't revert
            } catch (error) {
                // Check if the error message matches the expected revert reason
                assert.include(
                  error.message,
                  "revert",
                  "Incorrect password"
                );
            }
        })
    })
    
    describe('authorization', () => {
        it("should be able to add accessor", async function() {
            await contract.signup(username2, email2, password2, {from: thirdAddress});

            await contract.addAccessor(thirdAddress,password1, {from: secondAddress});

            const authorization = await contract.getAccessorAuthorization(secondAddress, thirdAddress, {from: contractOwner});
            assert.isTrue(authorization);
        })

        it("Should not be able to add non existing user", async function(){
            try {
                await contract.addAccessor(forthAddress,password1, {from: secondAddress});
                assert.fail("Function should have reverted"); // Fail the test if it didn't revert
            } catch (error) {
                // Check if the error message matches the expected revert reason
                assert.include(
                  error.message,
                  "revert",
                  "Accessor does not exist"
                );
            }
        })

        it("Wrong password should not be able to add accessor", async function(){
            try {
                await contract.addAccessor(thirdAddress,password2, {from: secondAddress});
                assert.fail("Function should have reverted"); // Fail the test if it didn't revert
            } catch (error) {
                // Check if the error message matches the expected revert reason
                assert.include(
                  error.message,
                  "revert",
                  "Incorrect password"
                );
            }
        })

        it("should be able to remove accessor", async function() {
            await contract.removeAccessor(thirdAddress, password1, {from: secondAddress});

            const authorization = await contract.getAccessorAuthorization(secondAddress, thirdAddress, {from: contractOwner});
            assert.isFalse(authorization);
        })
    })

    describe('key assignment', () => {
        it("should be able to set key", async function() {            
            await contract.setKey(secondAddress, key, iv, {from: contractOwner});
            await contract.addAccessor(thirdAddress,password1, {from: secondAddress});

            const result = await contract.getKey(secondAddress, thirdAddress, {from: contractOwner});
            console.log(result);
            assert.equal(key, result['0']);
            assert.equal(iv, result['1']);
        })
    
        it("should not be able to set key", async function() {
            try {
                await contract.setKey(secondAddress, key, iv, {from: forthAddress});
                assert.fail("Function should have reverted"); // Fail the test if it didn't revert
            } catch (error) {
                // Check if the error message matches the expected revert reason
                assert.include(
                  error.message,
                  "revert",
                  "Only owner access"
                );
            }
        })

        it("should not be able to get key", async function() {
            try {
                await contract.getKey(secondAddress, thirdAddress, {from: forthAddress});
                assert.fail("Function should have reverted"); // Fail the test if it didn't revert
            } catch (error) {
                // Check if the error message matches the expected revert reason
                assert.include(
                  error.message,
                  "revert",
                  "Only owner access"
                );
            }
        })

        it("should not be able to get key using unauthorized accessor", async function() {
            try {
                await contract.removeAccessor(thirdAddress, password1, {from: secondAddress});
                await contract.getKey(secondAddress, thirdAddress, {from: contractOwner});
                assert.fail("Function should have reverted"); // Fail the test if it didn't revert
            } catch (error) {
                // Check if the error message matches the expected revert reason
                assert.include(
                  error.message,
                  "revert",
                  "Only Authorized Accessor"
                );
            }
        })
    })

    

    

});