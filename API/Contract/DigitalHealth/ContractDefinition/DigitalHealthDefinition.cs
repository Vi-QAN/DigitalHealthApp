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
        public static string BYTECODE = "608060405234801561001057600080fd5b50600080546001600160a01b03191633179055610a42806100326000396000f3fe608060405234801561001057600080fd5b50600436106100935760003560e01c8063635a9f2211610066578063635a9f2214610109578063690419d41461011c5780636f77926b1461012f578063bc29855314610174578063cfb51928146101a557600080fd5b8063035675c5146100985780631a2dc634146100ad5780635016a3b1146100d357806356a55622146100f6575b600080fd5b6100ab6100a63660046107d4565b6101b8565b005b6100c06100bb366004610821565b61022a565b6040519081526020015b60405180910390f35b6100e66100e136600461084d565b6102ca565b60405190151581526020016100ca565b6100ab610104366004610880565b61034b565b6100c06101173660046108aa565b61045e565b6100ab61012a366004610880565b610554565b61014261013d3660046108cc565b61066a565b6040805195865260208601949094529284019190915260608301526001600160801b031916608082015260a0016100ca565b61018761018236600461084d565b6106e0565b604080519283526001600160801b03199091166020830152016100ca565b6100c06101b3366004610904565b610799565b6000546001600160a01b031633146101eb5760405162461bcd60e51b81526004016101e2906109b5565b60405180910390fd5b6001600160a01b03929092166000908152600160205260409020600381019190915560040180546001600160801b03191660809290921c919091179055565b6000838082036102705760405162461bcd60e51b8152602060048201526011602482015270557365726e616d6520697320656d70747960781b60448201526064016101e2565b3360009081526001602052604081205490036102af573360009081526001602081905260409091208681559081018590556002018390558491506102c2565b3360009081526001602052604090205491505b509392505050565b600080546001600160a01b031633146102f55760405162461bcd60e51b81526004016101e2906109b5565b816001600160a01b0316836001600160a01b03160361031657506001610345565b506001600160a01b038083166000908152600160209081526040808320938516835260059093019052205460ff165b92915050565b6001600160a01b0382166000908152600160205260408120548391036103ad5760405162461bcd60e51b81526020600482015260176024820152761058d8d95cdcdbdc88191bd95cc81b9bdd08195e1a5cdd604a1b60448201526064016101e2565b8160008190036103f25760405162461bcd60e51b815260206004820152601060248201526f125b9d985b1a59081c185cdcdddbdc9960821b60448201526064016101e2565b33600090815260016020526040902060020154839081146104255760405162461bcd60e51b81526004016101e2906109e0565b50503360009081526001602090815260408083206001600160a01b039690961683526005909501905292909220805460ff191690555050565b3360009081526001602052604081205481036104b25760405162461bcd60e51b8152602060048201526013602482015272155cd95c88191bd95cc81b9bdd08195e1a5cdd606a1b60448201526064016101e2565b3360009081526001602081905260409091200154839081146105085760405162461bcd60e51b815260206004820152600f60248201526e125b98dbdc9c9958dd08195b585a5b608a1b60448201526064016101e2565b336000908152600160205260409020600201548390811461053b5760405162461bcd60e51b81526004016101e2906109e0565b5050336000908152600160205260409020549392505050565b6001600160a01b0382166000908152600160205260408120548391036105b65760405162461bcd60e51b81526020600482015260176024820152761058d8d95cdcdbdc88191bd95cc81b9bdd08195e1a5cdd604a1b60448201526064016101e2565b8160008190036105fb5760405162461bcd60e51b815260206004820152601060248201526f125b9d985b1a59081c185cdcdddbdc9960821b60448201526064016101e2565b336000908152600160205260409020600201548390811461062e5760405162461bcd60e51b81526004016101e2906109e0565b50503360009081526001602081815260408084206001600160a01b0397909716845260059096019052939020805460ff19169093179092555050565b6000805481908190819081906001600160a01b0316331461069d5760405162461bcd60e51b81526004016101e2906109b5565b505050506001600160a01b039190911660009081526001602081905260409091208054918101546002820154600383015460049093015493959194509260801b90565b6000805481906001600160a01b0316331461070d5760405162461bcd60e51b81526004016101e2906109b5565b838361071982826102ca565b6107655760405162461bcd60e51b815260206004820152601860248201527f4f6e6c7920417574686f72697a6564204163636573736f72000000000000000060448201526064016101e2565b6001600160a01b0386166000908152600160205260409020600381015460049091015490945060801b925050509250929050565b8051600090829082036107af5750600092915050565b50506020015190565b80356001600160a01b03811681146107cf57600080fd5b919050565b6000806000606084860312156107e957600080fd5b6107f2846107b8565b92506020840135915060408401356001600160801b03198116811461081657600080fd5b809150509250925092565b60008060006060848603121561083657600080fd5b505081359360208301359350604090920135919050565b6000806040838503121561086057600080fd5b610869836107b8565b9150610877602084016107b8565b90509250929050565b6000806040838503121561089357600080fd5b61089c836107b8565b946020939093013593505050565b600080604083850312156108bd57600080fd5b50508035926020909101359150565b6000602082840312156108de57600080fd5b6108e7826107b8565b9392505050565b634e487b7160e01b600052604160045260246000fd5b60006020828403121561091657600080fd5b813567ffffffffffffffff8082111561092e57600080fd5b818401915084601f83011261094257600080fd5b813581811115610954576109546108ee565b604051601f8201601f19908116603f0116810190838211818310171561097c5761097c6108ee565b8160405282815287602084870101111561099557600080fd5b826020860160208301376000928101602001929092525095945050505050565b6020808252601190820152704f6e6c79206f776e65722061636365737360781b604082015260600190565b602080825260129082015271125b98dbdc9c9958dd081c185cdcdddbdc9960721b60408201526060019056fea2646970667358221220ebcfafec799ef4e4094315ccc3a3a113d807b648bc500cfdc68dacc117ca468664736f6c63430008130033";
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

    public partial class GetUserFunction : GetUserFunctionBase { }

    [Function("getUser", typeof(GetUserOutputDTO))]
    public class GetUserFunctionBase : FunctionMessage
    {
        [Parameter("address", "u", 1)]
        public virtual string U { get; set; }
    }

    public partial class LoginFunction : LoginFunctionBase { }

    [Function("login", "bytes32")]
    public class LoginFunctionBase : FunctionMessage
    {
        [Parameter("bytes32", "email", 1)]
        public virtual byte[] Email { get; set; }
        [Parameter("bytes32", "password", 2)]
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

    public partial class GetUserOutputDTO : GetUserOutputDTOBase { }

    [FunctionOutput]
    public class GetUserOutputDTOBase : IFunctionOutputDTO 
    {
        [Parameter("bytes32", "name", 1)]
        public virtual byte[] Name { get; set; }
        [Parameter("bytes32", "email", 2)]
        public virtual byte[] Email { get; set; }
        [Parameter("bytes32", "password", 3)]
        public virtual byte[] Password { get; set; }
        [Parameter("bytes32", "key", 4)]
        public virtual byte[] Key { get; set; }
        [Parameter("bytes16", "iv", 5)]
        public virtual byte[] Iv { get; set; }
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
