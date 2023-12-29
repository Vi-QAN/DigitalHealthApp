using HealthSharer.Abstractions;
using Nethereum.Web3.Accounts;
using Nethereum.Web3;
using Contracts.Contracts.DigitalHealth;

namespace HealthSharer.Services
{
    public class ContractService : IContractService
    {
        public async Task Connect()
        {
            var privateKey = "0x3144042202ba5c60d38815e8742b6a04891e57c65c4508f9f2d0ff5fc666a2eb";
            string url = "http://localhost:7545";
            var contractAddress = "0x84327f7cA412b254Ab05AB55AF92587C6F827be4";
            var account = new Account(privateKey);
            var web3 = new Web3(account, url);
            var service = new DigitalHealthService(web3, contractAddress);
        }
    }
}
