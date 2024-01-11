using HealthSharer.Abstractions;
using Nethereum.Web3.Accounts;
using Nethereum.Web3;
using Contracts.Contracts.DigitalHealth;
using HealthSharer.Models;
using Microsoft.AspNetCore.Identity;
using Nethereum.Util;
using Microsoft.EntityFrameworkCore.Metadata.Internal;
using Nethereum.Contracts;

namespace HealthSharer.Services
{
    public class ContractService : IContractService
    {
        private readonly DigitalHealthService _service;
        
        public ContractService()
        {
            var privateKey = "0x3144042202ba5c60d38815e8742b6a04891e57c65c4508f9f2d0ff5fc666a2eb";
            string url = "http://localhost:7545";
            var contractAddress = "0x0dd1a267A7ceAb740E436Fb6978dDBB5b9205584";
            var account = new Account(privateKey, 1337);
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
            try
            {
                var result = await _service.SetKeyRequestAndWaitForReceiptAsync(
                    new Contracts.Contracts.DigitalHealth.ContractDefinition.SetKeyFunction()
                    {
                        User = user,
                        Key = random.key,
                        Iv = random.iv,
                    });
            }
            catch (Exception ex)
            {
                Console.WriteLine("Error in SetKey: " + ex.Message);
            }

        }


    }
}
