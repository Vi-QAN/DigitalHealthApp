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
        public static string BYTECODE = "0x";
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

    [Function("getKey", "bytes32")]
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
