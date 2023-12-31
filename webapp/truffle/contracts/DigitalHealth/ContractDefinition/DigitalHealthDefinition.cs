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
        public static string BYTECODE = "608060405234801561001057600080fd5b50600080546001600160a01b03191633179055610814806100326000396000f3fe608060405234801561001057600080fd5b50600436106100935760003560e01c8063690419d411610066578063690419d41461010a578063879281c41461011d5780638b14724514610130578063bc29855314610143578063cfb519281461017457600080fd5b8063035675c5146100985780631012507d146100ad5780631a2dc634146100d657806356a55622146100f7575b600080fd5b6100ab6100a63660046105d0565b610187565b005b6100c06100bb36600461061d565b610227565b6040519051151581526020015b60405180910390f35b6100e96100e4366004610650565b6102a1565b6040519081526020016100cd565b6100ab61010536600461067c565b61030a565b6100ab61011836600461067c565b61038c565b6100e961012b3660046106a6565b610413565b6100e961013e3660046106a6565b610472565b61015661015136600461061d565b6104e0565b604080519283526001600160801b03199091166020830152016100cd565b6100e96101823660046106d5565b61059a565b3360009081526001602052604081205490036101be5760405162461bcd60e51b81526004016101b590610786565b60405180910390fd5b6000546001600160a01b031633146101e85760405162461bcd60e51b81526004016101b5906107b3565b6001600160a01b03929092166000908152600160205260409020600381019190915560040180546001600160801b03191660809290921c919091179055565b6040805160208101909152600081526000546001600160a01b031633146102605760405162461bcd60e51b81526004016101b5906107b3565b506001600160a01b039182166000908152600160209081526040808320939094168252600590920182528290208251918201909252905460ff161515815290565b6000838082036102b057600080fd5b3360009081526001602052604081205490036102ef57336000908152600160208190526040909120868155908101859055600201839055849150610302565b3360009081526001602052604090205491505b509392505050565b3360009081526001602052604081205490036103385760405162461bcd60e51b81526004016101b590610786565b336000908152600160205260409020600201548190811461035857600080fd5b50503360009081526001602090815260408083206001600160a01b039490941683526005909301905220805460ff19169055565b3360009081526001602052604081205490036103ba5760405162461bcd60e51b81526004016101b590610786565b33600090815260016020526040902060020154819081146103da57600080fd5b50503360009081526001602081815260408084206001600160a01b0395909516845260059094019052919020805460ff19169091179055565b3360009081526001602052604081205481036104415760405162461bcd60e51b81526004016101b590610786565b3360009081526001602052604090206002015482900361046d5750336000908152600160205260409020545b919050565b60008180820361048157600080fd5b3360009081526001602052604081205490036104af5760405162461bcd60e51b81526004016101b590610786565b33600090815260016020526040902054156104da573360009081526001602052604090208390558291505b50919050565b6000805481906001600160a01b0316331461050d5760405162461bcd60e51b81526004016101b5906107b3565b83836105198282610227565b516105665760405162461bcd60e51b815260206004820152601860248201527f4f6e6c7920417574686f72697a6564204163636573736f72000000000000000060448201526064016101b5565b6001600160a01b0386166000908152600160205260409020600381015460049091015490945060801b925050509250929050565b8051600090829082036105b05750600092915050565b50506020015190565b80356001600160a01b038116811461046d57600080fd5b6000806000606084860312156105e557600080fd5b6105ee846105b9565b92506020840135915060408401356001600160801b03198116811461061257600080fd5b809150509250925092565b6000806040838503121561063057600080fd5b610639836105b9565b9150610647602084016105b9565b90509250929050565b60008060006060848603121561066557600080fd5b505081359360208301359350604090920135919050565b6000806040838503121561068f57600080fd5b610698836105b9565b946020939093013593505050565b6000602082840312156106b857600080fd5b5035919050565b634e487b7160e01b600052604160045260246000fd5b6000602082840312156106e757600080fd5b813567ffffffffffffffff808211156106ff57600080fd5b818401915084601f83011261071357600080fd5b813581811115610725576107256106bf565b604051601f8201601f19908116603f0116810190838211818310171561074d5761074d6106bf565b8160405282815287602084870101111561076657600080fd5b826020860160208301376000928101602001929092525095945050505050565b602080825260139082015272155cd95c88191bd95cc81b9bdd08195e1a5cdd606a1b604082015260600190565b6020808252601190820152704f6e6c79206f776e65722061636365737360781b60408201526060019056fea2646970667358221220b70bafa3dc75d686a44673c255c611b99d1d8675cf7fa560de3bffb85eb7c66364736f6c63430008130033";
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

    public partial class GetAccessorFunction : GetAccessorFunctionBase { }

    [Function("getAccessor", typeof(GetAccessorOutputDTO))]
    public class GetAccessorFunctionBase : FunctionMessage
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



    public partial class GetAccessorOutputDTO : GetAccessorOutputDTOBase { }

    [FunctionOutput]
    public class GetAccessorOutputDTOBase : IFunctionOutputDTO 
    {
        [Parameter("tuple", "", 1)]
        public virtual Doctor ReturnValue1 { get; set; }
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
