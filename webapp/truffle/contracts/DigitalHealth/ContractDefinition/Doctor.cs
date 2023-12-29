using System;
using System.Threading.Tasks;
using System.Collections.Generic;
using System.Numerics;
using Nethereum.Hex.HexTypes;
using Nethereum.ABI.FunctionEncoding.Attributes;

namespace Contracts.Contracts.DigitalHealth.ContractDefinition
{
    public partial class Doctor : DoctorBase { }

    public class DoctorBase 
    {
        [Parameter("bool", "authorized", 1)]
        public virtual bool Authorized { get; set; }
    }
}
