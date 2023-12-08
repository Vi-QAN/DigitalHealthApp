
using System.ComponentModel.DataAnnotations.Schema;
using System.Runtime.Intrinsics.X86;

namespace WebData.Models
{
    public class User : Identity
    {

        public string? Name { get; set; }
        public string? HomeAddress { get; set; }
        public string? Phone { get; set; }
        
        public string ContractAddress { get; set; }
        
        /*public virtual IEnumerable<Conversation> Conversations { get; set; }*/
        public virtual IEnumerable<Information> Information { get; set; }
        public virtual IEnumerable<User> OwnedRecords { get; set; }
        public virtual IEnumerable<User> AccessedRecords { get; set; }
        public virtual IEnumerable<AuthorizationRecord> AuthorizationRecords { get; set; }
    }

    public class AuthorizationRecord
    {
        public int OwnerId { get; set; }
        public int AccessorId { get; set; }
        public bool IsAuthorized { get; set; }
        
    }

    /*public class Patient : User { 
        public int Age { get; set; }
        public int Sex { get; set; }
        public DateTime RegistrationDate { get; set; }

        public virtual Device Device { get; set; }
    }

    public class Doctor : User { 
    
    }*/
}
