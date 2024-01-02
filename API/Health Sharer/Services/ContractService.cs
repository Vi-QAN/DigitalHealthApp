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
                //var iv = "0x" + BitConverter.ToString(random.iv).Replace("-", "");
                //var key = "0x" + BitConverter.ToString(random.key).Replace("-", "");
                var gasPrice = Web3.Convert.ToWei(5, UnitConversion.EthUnit.Gwei);
                var result = await _service.SetKeyRequestAndWaitForReceiptAsync(
                    new Contracts.Contracts.DigitalHealth.ContractDefinition.SetKeyFunction()
                    {
                        User = user,
                        Key = random.key,
                        Iv = random.iv,
                        
                    });

                Console.WriteLine($"Finished storing an int: Tx Hash: {result.TransactionHash}");
                Console.WriteLine($"Finished storing an int: Tx Status: {result.Status.Value}");
                Console.WriteLine("");

                Console.WriteLine("Calling the function get()...");
                var intValueFromGetFunctionCall = await _service.GetKeyQueryAsync(user,user);
                Console.WriteLine($"Int value: {intValueFromGetFunctionCall} (expecting value 42)");
                Console.WriteLine("");
                // Check if the transaction was successful
                if (result.Status == null || result.Status.Value != 1)
                {
                    // Transaction failed
                    Console.WriteLine("Transaction failed. Status: " + result.Status?.ToString());
                }
                else
                {
                    Console.WriteLine("Transaction successful. Transaction hash: " + result.TransactionHash);
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine("Error in SetKey: " + ex.Message);
            }

        }


    }
}
