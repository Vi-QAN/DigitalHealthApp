using System;
using System.Threading.Tasks;
using System.Collections.Generic;
using System.Numerics;
using Nethereum.Hex.HexTypes;
using Nethereum.ABI.FunctionEncoding.Attributes;
using Nethereum.Web3;
using Nethereum.RPC.Eth.DTOs;
using Nethereum.Contracts.CQS;
using Nethereum.Contracts.ContractHandlers;
using Nethereum.Contracts;
using System.Threading;
using Contracts.Contracts.DigitalHealth.ContractDefinition;

namespace Contracts.Contracts.DigitalHealth
{
    public partial class DigitalHealthService
    {
        public static Task<TransactionReceipt> DeployContractAndWaitForReceiptAsync(Nethereum.Web3.Web3 web3, DigitalHealthDeployment digitalHealthDeployment, CancellationTokenSource cancellationTokenSource = null)
        {
            return web3.Eth.GetContractDeploymentHandler<DigitalHealthDeployment>().SendRequestAndWaitForReceiptAsync(digitalHealthDeployment, cancellationTokenSource);
        }

        public static Task<string> DeployContractAsync(Nethereum.Web3.Web3 web3, DigitalHealthDeployment digitalHealthDeployment)
        {
            return web3.Eth.GetContractDeploymentHandler<DigitalHealthDeployment>().SendRequestAsync(digitalHealthDeployment);
        }

        public static async Task<DigitalHealthService> DeployContractAndGetServiceAsync(Nethereum.Web3.Web3 web3, DigitalHealthDeployment digitalHealthDeployment, CancellationTokenSource cancellationTokenSource = null)
        {
            var receipt = await DeployContractAndWaitForReceiptAsync(web3, digitalHealthDeployment, cancellationTokenSource);
            return new DigitalHealthService(web3, receipt.ContractAddress);
        }

        protected Nethereum.Web3.Web3 Web3{ get; }

        public ContractHandler ContractHandler { get; }

        public DigitalHealthService(Nethereum.Web3.Web3 web3, string contractAddress)
        {
            Web3 = web3;
            ContractHandler = web3.Eth.GetContractHandler(contractAddress);
        }

        public Task<string> AddAccessorRequestAsync(AddAccessorFunction addAccessorFunction)
        {
             return ContractHandler.SendRequestAsync(addAccessorFunction);
        }

        public Task<TransactionReceipt> AddAccessorRequestAndWaitForReceiptAsync(AddAccessorFunction addAccessorFunction, CancellationTokenSource cancellationToken = null)
        {
             return ContractHandler.SendRequestAndWaitForReceiptAsync(addAccessorFunction, cancellationToken);
        }

        public Task<string> AddAccessorRequestAsync(string accessor, byte[] password)
        {
            var addAccessorFunction = new AddAccessorFunction();
                addAccessorFunction.Accessor = accessor;
                addAccessorFunction.Password = password;
            
             return ContractHandler.SendRequestAsync(addAccessorFunction);
        }

        public Task<TransactionReceipt> AddAccessorRequestAndWaitForReceiptAsync(string accessor, byte[] password, CancellationTokenSource cancellationToken = null)
        {
            var addAccessorFunction = new AddAccessorFunction();
                addAccessorFunction.Accessor = accessor;
                addAccessorFunction.Password = password;
            
             return ContractHandler.SendRequestAndWaitForReceiptAsync(addAccessorFunction, cancellationToken);
        }

        public Task<bool> GetAccessorAuthorizationQueryAsync(GetAccessorAuthorizationFunction getAccessorAuthorizationFunction, BlockParameter blockParameter = null)
        {
            return ContractHandler.QueryAsync<GetAccessorAuthorizationFunction, bool>(getAccessorAuthorizationFunction, blockParameter);
        }

        
        public Task<bool> GetAccessorAuthorizationQueryAsync(string user, string accessor, BlockParameter blockParameter = null)
        {
            var getAccessorAuthorizationFunction = new GetAccessorAuthorizationFunction();
                getAccessorAuthorizationFunction.User = user;
                getAccessorAuthorizationFunction.Accessor = accessor;
            
            return ContractHandler.QueryAsync<GetAccessorAuthorizationFunction, bool>(getAccessorAuthorizationFunction, blockParameter);
        }

        public Task<GetKeyOutputDTO> GetKeyQueryAsync(GetKeyFunction getKeyFunction, BlockParameter blockParameter = null)
        {
            return ContractHandler.QueryDeserializingToObjectAsync<GetKeyFunction, GetKeyOutputDTO>(getKeyFunction, blockParameter);
        }

        public Task<GetKeyOutputDTO> GetKeyQueryAsync(string user, string accessor, BlockParameter blockParameter = null)
        {
            var getKeyFunction = new GetKeyFunction();
                getKeyFunction.User = user;
                getKeyFunction.Accessor = accessor;
            
            return ContractHandler.QueryDeserializingToObjectAsync<GetKeyFunction, GetKeyOutputDTO>(getKeyFunction, blockParameter);
        }

        public Task<byte[]> LoginQueryAsync(LoginFunction loginFunction, BlockParameter blockParameter = null)
        {
            return ContractHandler.QueryAsync<LoginFunction, byte[]>(loginFunction, blockParameter);
        }

        
        public Task<byte[]> LoginQueryAsync(byte[] password, BlockParameter blockParameter = null)
        {
            var loginFunction = new LoginFunction();
                loginFunction.Password = password;
            
            return ContractHandler.QueryAsync<LoginFunction, byte[]>(loginFunction, blockParameter);
        }

        public Task<string> RemoveAccessorRequestAsync(RemoveAccessorFunction removeAccessorFunction)
        {
             return ContractHandler.SendRequestAsync(removeAccessorFunction);
        }

        public Task<TransactionReceipt> RemoveAccessorRequestAndWaitForReceiptAsync(RemoveAccessorFunction removeAccessorFunction, CancellationTokenSource cancellationToken = null)
        {
             return ContractHandler.SendRequestAndWaitForReceiptAsync(removeAccessorFunction, cancellationToken);
        }

        public Task<string> RemoveAccessorRequestAsync(string accessor, byte[] password)
        {
            var removeAccessorFunction = new RemoveAccessorFunction();
                removeAccessorFunction.Accessor = accessor;
                removeAccessorFunction.Password = password;
            
             return ContractHandler.SendRequestAsync(removeAccessorFunction);
        }

        public Task<TransactionReceipt> RemoveAccessorRequestAndWaitForReceiptAsync(string accessor, byte[] password, CancellationTokenSource cancellationToken = null)
        {
            var removeAccessorFunction = new RemoveAccessorFunction();
                removeAccessorFunction.Accessor = accessor;
                removeAccessorFunction.Password = password;
            
             return ContractHandler.SendRequestAndWaitForReceiptAsync(removeAccessorFunction, cancellationToken);
        }

        public Task<string> SetKeyRequestAsync(SetKeyFunction setKeyFunction)
        {
             return ContractHandler.SendRequestAsync(setKeyFunction);
        }

        public Task<TransactionReceipt> SetKeyRequestAndWaitForReceiptAsync(SetKeyFunction setKeyFunction, CancellationTokenSource cancellationToken = null)
        {
             return ContractHandler.SendRequestAndWaitForReceiptAsync(setKeyFunction, cancellationToken);
        }

        public Task<string> SetKeyRequestAsync(string user, byte[] key, byte[] iv)
        {
            var setKeyFunction = new SetKeyFunction();
                setKeyFunction.User = user;
                setKeyFunction.Key = key;
                setKeyFunction.Iv = iv;
            
             return ContractHandler.SendRequestAsync(setKeyFunction);
        }

        public Task<TransactionReceipt> SetKeyRequestAndWaitForReceiptAsync(string user, byte[] key, byte[] iv, CancellationTokenSource cancellationToken = null)
        {
            var setKeyFunction = new SetKeyFunction();
                setKeyFunction.User = user;
                setKeyFunction.Key = key;
                setKeyFunction.Iv = iv;
            
             return ContractHandler.SendRequestAndWaitForReceiptAsync(setKeyFunction, cancellationToken);
        }

        public Task<string> SignupRequestAsync(SignupFunction signupFunction)
        {
             return ContractHandler.SendRequestAsync(signupFunction);
        }

        public Task<TransactionReceipt> SignupRequestAndWaitForReceiptAsync(SignupFunction signupFunction, CancellationTokenSource cancellationToken = null)
        {
             return ContractHandler.SendRequestAndWaitForReceiptAsync(signupFunction, cancellationToken);
        }

        public Task<string> SignupRequestAsync(byte[] name, byte[] email, byte[] password)
        {
            var signupFunction = new SignupFunction();
                signupFunction.Name = name;
                signupFunction.Email = email;
                signupFunction.Password = password;
            
             return ContractHandler.SendRequestAsync(signupFunction);
        }

        public Task<TransactionReceipt> SignupRequestAndWaitForReceiptAsync(byte[] name, byte[] email, byte[] password, CancellationTokenSource cancellationToken = null)
        {
            var signupFunction = new SignupFunction();
                signupFunction.Name = name;
                signupFunction.Email = email;
                signupFunction.Password = password;
            
             return ContractHandler.SendRequestAndWaitForReceiptAsync(signupFunction, cancellationToken);
        }

        public Task<byte[]> StringToBytes32QueryAsync(StringToBytes32Function stringToBytes32Function, BlockParameter blockParameter = null)
        {
            return ContractHandler.QueryAsync<StringToBytes32Function, byte[]>(stringToBytes32Function, blockParameter);
        }

        
        public Task<byte[]> StringToBytes32QueryAsync(string source, BlockParameter blockParameter = null)
        {
            var stringToBytes32Function = new StringToBytes32Function();
                stringToBytes32Function.Source = source;
            
            return ContractHandler.QueryAsync<StringToBytes32Function, byte[]>(stringToBytes32Function, blockParameter);
        }

        public Task<string> UpdateRequestAsync(UpdateFunction updateFunction)
        {
             return ContractHandler.SendRequestAsync(updateFunction);
        }

        public Task<TransactionReceipt> UpdateRequestAndWaitForReceiptAsync(UpdateFunction updateFunction, CancellationTokenSource cancellationToken = null)
        {
             return ContractHandler.SendRequestAndWaitForReceiptAsync(updateFunction, cancellationToken);
        }

        public Task<string> UpdateRequestAsync(byte[] name)
        {
            var updateFunction = new UpdateFunction();
                updateFunction.Name = name;
            
             return ContractHandler.SendRequestAsync(updateFunction);
        }

        public Task<TransactionReceipt> UpdateRequestAndWaitForReceiptAsync(byte[] name, CancellationTokenSource cancellationToken = null)
        {
            var updateFunction = new UpdateFunction();
                updateFunction.Name = name;
            
             return ContractHandler.SendRequestAndWaitForReceiptAsync(updateFunction, cancellationToken);
        }
    }
}
