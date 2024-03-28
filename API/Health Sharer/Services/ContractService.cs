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
        private readonly ILogger _logger;
        private static string URL = $"{Environment.GetEnvironmentVariable("CHAIN_CONNECTION")}";

        public ContractService(ILogger<ContractService> logger)
        {
            _logger = logger;

            try
            {
                var privateKey = Environment.GetEnvironmentVariable("PRIVATE_KEY");

                var contractAddress = Environment.GetEnvironmentVariable("CONTRACT_ADDRESS");
                var account = new Account(privateKey, 1337);
                var web3 = new Web3(account, URL);
                _service = new DigitalHealthService(web3, contractAddress);
                _logger.LogInformation("Private Key: {PrivateKey}, Contract Address: {ContractAddress}", privateKey, contractAddress);
            } catch (Exception ex)
            {
                _logger.LogError("Error in init contract {Error}", ex.Message);
            }

        }

        public async Task<RandomSeed> GetKey(string user, string accessor)
        {
            try
            {
                var key = await _service.GetKeyQueryAsync(user, accessor);
                
                var seed = new RandomSeed()
                {
                    key = key.ReturnValue1,
                    iv = key.ReturnValue2,
                };

                _logger.LogInformation("Key: {Key}, IV: {Iv}",seed.key,seed.iv );

                return seed;
            } catch (Exception ex)
            {
                _logger.LogError("Error in get key {Error} {url}", ex.Message, URL);
                return null;
            }
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
                _logger.LogInformation("Set Key successfully");
            }
            catch (Exception ex)
            {
                _logger.LogError("Error in SetKey: {error} {url}", ex.Message, URL);
            }

        }
    }
}
