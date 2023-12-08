const DigitalHealth = artifacts.require("DigitalHealth");


contract("Authorizaton test cases", function(accounts) {
    const name  = "0xb2840da3ac4e2057915102bc9dc97c336fbf2701c5444522e3490383f524db59";
    const key = "0xa454f7cadf32b26588f51a41e6400ce3fc4b93314e33538b941e301cbab4afd6";
    
    it("Should be able to sign up", async function() {
        const token = await DigitalHealth.deployed();
        
        const result = await token.signup(name);

        assert.equal(result,name,'Cannot singup');
    })

    it("should be able to set key", async function() {
        const token = await DigitalHealth.deployed();
        
        await token.signup(name);
        await token.setKey(accounts[0],key);

        const id = 1;
        await token.addAccesser(accounts[0],id);

        assert.equal(await token.getKey(accounts[0],1),key,'Dir is not set')
    })
 
    it("should not be able to set key", async function() {
        const token = await DigitalHealth.deployed();
        var key = "0xa454f7cadf32b26588f51a41e6400ce3fc4b93314e33538b941e301cbab4afd6";

        assert.throws(await token.setKey(accounts[0], key, {from: accounts[1]}))
    })

    it("should be able to add accessor", async function() {
        const token = await DigitalHealth.deployed();
        const id = 1;
        await token.addAccesser(accounts[0],id);

        const accesser = await token.getAccesser(accounts[0], id);
        assert.isTrue(accesser.authorized);
    })

    it("should not be able to add accessor", async function() {
        const token = await DigitalHealth.deployed();
        const name = "Accessor 1";
        const id = 1;

        await expect(await token.addAccesser(accounts[0], id, {from: accounts[2]})).to.include("reverted")
    })

});