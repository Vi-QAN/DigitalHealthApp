using HealthSharer.Abstractions;
using Nethereum.Web3.Accounts;
using Nethereum.Web3;
using Contracts.Contracts.DigitalHealth;
using HealthSharer.Models;
using Microsoft.AspNetCore.Identity;

namespace HealthSharer.Services
{
    public class ContractService : IContractService
    {
        private readonly DigitalHealthService _service;
        
        public ContractService()
        {
            var privateKey = "0x3144042202ba5c60d38815e8742b6a04891e57c65c4508f9f2d0ff5fc666a2eb";
            string url = "http://localhost:7545";
            var contractAddress = "0x84327f7cA412b254Ab05AB55AF92587C6F827be4";
            var account = new Account(privateKey);
            var web3 = new Web3(account, url);
            _service = new DigitalHealthService(web3, contractAddress);
        }

        public async Task<RandomSeed> GetKey(string user, string accessor)
        {
            var key = await _service.GetKeyQueryAsync(user, accessor);
            return new RandomSeed()
            {
               key = key.ReturnValue1,
               iv = key.ReturnValue2,
            };
        }

        public async Task SetKey(string user, RandomSeed random)
        {
            await _service.SetKeyRequestAsync(user, random.key, random.iv);
        }


    }
}
