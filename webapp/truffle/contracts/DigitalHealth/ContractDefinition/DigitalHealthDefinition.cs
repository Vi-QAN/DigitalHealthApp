using System;
using System.Threading.Tasks;
using System.Collections.Generic;
using System.Numerics;
using Nethereum.Hex.HexTypes;
using Nethereum.ABI.FunctionEncoding.Attributes;
using Nethereum.Web3;
using Nethereum.RPC.Eth.DTOs;
using Nethereum.Contracts.CQS;
using Nethereum.Contracts;
using System.Threading;

namespace Contracts.Contracts.DigitalHealth.ContractDefinition
{


    public partial class DigitalHealthDeployment : DigitalHealthDeploymentBase
    {
        public DigitalHealthDeployment() : base(BYTECODE) { }
        public DigitalHealthDeployment(string byteCode) : base(byteCode) { }
    }

    public class DigitalHealthDeploymentBase : ContractDeploymentMessage
    {
        public static string BYTECODE = "608060405234801561001057600080fd5b50600080546001600160a01b031916331790556108fc806100326000396000f3fe608060405234801561001057600080fd5b50600436106100935760003560e01c8063690419d411610066578063690419d414610109578063879281c41461011c5780638b1472451461012f578063bc29855314610142578063cfb519281461017357600080fd5b8063035675c5146100985780631a2dc634146100ad5780635016a3b1146100d357806356a55622146100f6575b600080fd5b6100ab6100a63660046106b8565b610186565b005b6100c06100bb366004610705565b6101f8565b6040519081526020015b60405180910390f35b6100e66100e1366004610731565b610261565b60405190151581526020016100ca565b6100ab610104366004610764565b6102e2565b6100ab610117366004610764565b6103ea565b6100c061012a36600461078e565b6104f5565b6100c061013d36600461078e565b61055b565b610155610150366004610731565b6105c9565b604080519283526001600160801b03199091166020830152016100ca565b6100c06101813660046107bd565b610682565b6000546001600160a01b031633146101b95760405162461bcd60e51b81526004016101b09061086e565b60405180910390fd5b6001600160a01b03929092166000908152600160205260409020600381019190915560040180546001600160801b03191660809290921c919091179055565b60008380820361020757600080fd5b33600090815260016020526040812054900361024657336000908152600160208190526040909120868155908101859055600201839055849150610259565b3360009081526001602052604090205491505b509392505050565b600080546001600160a01b0316331461028c5760405162461bcd60e51b81526004016101b09061086e565b816001600160a01b0316836001600160a01b0316036102ad575060016102dc565b506001600160a01b038083166000908152600160209081526040808320938516835260059093019052205460ff165b92915050565b3360009081526001602052604081205490036103105760405162461bcd60e51b81526004016101b090610899565b8060008190036103555760405162461bcd60e51b815260206004820152601060248201526f125b9d985b1a59081c185cdcdddbdc9960821b60448201526064016101b0565b33600090815260016020526040902060020154829081146103b25760405162461bcd60e51b815260206004820152601760248201527627b7363c9030baba3432b73a34b1b0ba32b2103ab9b2b960491b60448201526064016101b0565b50503360009081526001602090815260408083206001600160a01b039590951683526005909401905291909120805460ff1916905550565b3360009081526001602052604081205490036104185760405162461bcd60e51b81526004016101b090610899565b80600081900361045d5760405162461bcd60e51b815260206004820152601060248201526f125b9d985b1a59081c185cdcdddbdc9960821b60448201526064016101b0565b33600090815260016020526040902060020154829081146104ba5760405162461bcd60e51b815260206004820152601760248201527627b7363c9030baba3432b73a34b1b0ba32b2103ab9b2b960491b60448201526064016101b0565b50503360009081526001602081815260408084206001600160a01b0396909616845260059095019052929020805460ff191690921790915550565b3360009081526001602052604081205481036105235760405162461bcd60e51b81526004016101b090610899565b336000908152600160205260409020600201548290036105525750503360009081526001602052604090205490565b5060005b919050565b60008180820361056a57600080fd5b3360009081526001602052604081205490036105985760405162461bcd60e51b81526004016101b090610899565b33600090815260016020526040902054156105c3573360009081526001602052604090208390558291505b50919050565b6000805481906001600160a01b031633146105f65760405162461bcd60e51b81526004016101b09061086e565b83836106028282610261565b61064e5760405162461bcd60e51b815260206004820152601860248201527f4f6e6c7920417574686f72697a6564204163636573736f72000000000000000060448201526064016101b0565b6001600160a01b0386166000908152600160205260409020600381015460049091015490945060801b925050509250929050565b8051600090829082036106985750600092915050565b50506020015190565b80356001600160a01b038116811461055657600080fd5b6000806000606084860312156106cd57600080fd5b6106d6846106a1565b92506020840135915060408401356001600160801b0319811681146106fa57600080fd5b809150509250925092565b60008060006060848603121561071a57600080fd5b505081359360208301359350604090920135919050565b6000806040838503121561074457600080fd5b61074d836106a1565b915061075b602084016106a1565b90509250929050565b6000806040838503121561077757600080fd5b610780836106a1565b946020939093013593505050565b6000602082840312156107a057600080fd5b5035919050565b634e487b7160e01b600052604160045260246000fd5b6000602082840312156107cf57600080fd5b813567ffffffffffffffff808211156107e757600080fd5b818401915084601f8301126107fb57600080fd5b81358181111561080d5761080d6107a7565b604051601f8201601f19908116603f01168101908382118183101715610835576108356107a7565b8160405282815287602084870101111561084e57600080fd5b826020860160208301376000928101602001929092525095945050505050565b6020808252601190820152704f6e6c79206f776e65722061636365737360781b604082015260600190565b602080825260139082015272155cd95c88191bd95cc81b9bdd08195e1a5cdd606a1b60408201526060019056fea2646970667358221220bf2aca4362d9fdd9615b85b435d8bbf4fc7be73ee1c7feb538d8b689c9b1bb5164736f6c63430008130033";
        public DigitalHealthDeploymentBase() : base(BYTECODE) { }
        public DigitalHealthDeploymentBase(string byteCode) : base(byteCode) { }

    }

    public partial class AddAccessorFunction : AddAccessorFunctionBase { }

    [Function("addAccessor")]
    public class AddAccessorFunctionBase : FunctionMessage
    {
        [Parameter("address", "accessor", 1)]
        public virtual string Accessor { get; set; }
        [Parameter("bytes32", "password", 2)]
        public virtual byte[] Password { get; set; }
    }

    public partial class GetAccessorAuthorizationFunction : GetAccessorAuthorizationFunctionBase { }

    [Function("getAccessorAuthorization", "bool")]
    public class GetAccessorAuthorizationFunctionBase : FunctionMessage
    {
        [Parameter("address", "_user", 1)]
        public virtual string User { get; set; }
        [Parameter("address", "accessor", 2)]
        public virtual string Accessor { get; set; }
    }

    public partial class GetKeyFunction : GetKeyFunctionBase { }

    [Function("getKey", typeof(GetKeyOutputDTO))]
    public class GetKeyFunctionBase : FunctionMessage
    {
        [Parameter("address", "_user", 1)]
        public virtual string User { get; set; }
        [Parameter("address", "accessor", 2)]
        public virtual string Accessor { get; set; }
    }

    public partial class LoginFunction : LoginFunctionBase { }

    [Function("login", "bytes32")]
    public class LoginFunctionBase : FunctionMessage
    {
        [Parameter("bytes32", "password", 1)]
        public virtual byte[] Password { get; set; }
    }

    public partial class RemoveAccessorFunction : RemoveAccessorFunctionBase { }

    [Function("removeAccessor")]
    public class RemoveAccessorFunctionBase : FunctionMessage
    {
        [Parameter("address", "accessor", 1)]
        public virtual string Accessor { get; set; }
        [Parameter("bytes32", "password", 2)]
        public virtual byte[] Password { get; set; }
    }

    public partial class SetKeyFunction : SetKeyFunctionBase { }

    [Function("setKey")]
    public class SetKeyFunctionBase : FunctionMessage
    {
        [Parameter("address", "_user", 1)]
        public virtual string User { get; set; }
        [Parameter("bytes32", "_key", 2)]
        public virtual byte[] Key { get; set; }
        [Parameter("bytes16", "_iv", 3)]
        public virtual byte[] Iv { get; set; }
    }

    public partial class SignupFunction : SignupFunctionBase { }

    [Function("signup", "bytes32")]
    public class SignupFunctionBase : FunctionMessage
    {
        [Parameter("bytes32", "name", 1)]
        public virtual byte[] Name { get; set; }
        [Parameter("bytes32", "email", 2)]
        public virtual byte[] Email { get; set; }
        [Parameter("bytes32", "password", 3)]
        public virtual byte[] Password { get; set; }
    }

    public partial class StringToBytes32Function : StringToBytes32FunctionBase { }

    [Function("stringToBytes32", "bytes32")]
    public class StringToBytes32FunctionBase : FunctionMessage
    {
        [Parameter("string", "source", 1)]
        public virtual string Source { get; set; }
    }

    public partial class UpdateFunction : UpdateFunctionBase { }

    [Function("update", "bytes32")]
    public class UpdateFunctionBase : FunctionMessage
    {
        [Parameter("bytes32", "name", 1)]
        public virtual byte[] Name { get; set; }
    }



    public partial class GetAccessorAuthorizationOutputDTO : GetAccessorAuthorizationOutputDTOBase { }

    [FunctionOutput]
    public class GetAccessorAuthorizationOutputDTOBase : IFunctionOutputDTO 
    {
        [Parameter("bool", "authorized", 1)]
        public virtual bool Authorized { get; set; }
    }

    public partial class GetKeyOutputDTO : GetKeyOutputDTOBase { }

    [FunctionOutput]
    public class GetKeyOutputDTOBase : IFunctionOutputDTO 
    {
        [Parameter("bytes32", "", 1)]
        public virtual byte[] ReturnValue1 { get; set; }
        [Parameter("bytes16", "", 2)]
        public virtual byte[] ReturnValue2 { get; set; }
    }

    public partial class LoginOutputDTO : LoginOutputDTOBase { }

    [FunctionOutput]
    public class LoginOutputDTOBase : IFunctionOutputDTO 
    {
        [Parameter("bytes32", "name", 1)]
        public virtual byte[] Name { get; set; }
    }







    public partial class StringToBytes32OutputDTO : StringToBytes32OutputDTOBase { }

    [FunctionOutput]
    public class StringToBytes32OutputDTOBase : IFunctionOutputDTO 
    {
        [Parameter("bytes32", "result", 1)]
        public virtual byte[] Result { get; set; }
    }


}
