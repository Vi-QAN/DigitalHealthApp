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
            var privateKey = "0x1f9e4c87636d315bfdd38a62da3de72b553211488ea5a4dfd673fd8570a3b08a";
            string url = "http://127.0.0.1:8545";
            var contractAddress = "0xff3be30b9c317c2ae1d1fa76e5aea258953ee716";
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
