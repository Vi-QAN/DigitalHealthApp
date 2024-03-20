
using System.ComponentModel.DataAnnotations.Schema;
using System.Runtime.Intrinsics.X86;

namespace WebData.Models
{
    public class User : Identity
    {

        public string? Name { get; set; }
        public string? HomeAddress { get; set; }
        public string? Phone { get; set; }
        
        public string PublicKey { get; set; }
        
        /*public virtual IEnumerable<Conversation> Conversations { get; set; }*/
        public virtual IEnumerable<FileInformation> FileInformation { get; set; }
        public virtual IEnumerable<User> AsOwnerRecords { get; set; }
        public virtual IEnumerable<User> AsAccessorRecords { get; set; }

        public virtual IEnumerable<ActionLog> ActionLogs { get; set; }
        public virtual IEnumerable<Notification> Notifications { get; set; }
        public virtual IEnumerable<FileNote> FileNotes { get; set; }
    }

    public class AuthorizationRecord : Identity
    {
        public int OwnerId { get; set; }
        public int AccessorId { get; set; }
        public bool IsAuthorized { get; set; }  
        public DateTime AuthorizedDate { get; set; }
    }

    public class FileAuthorizationRecord : Identity
    {
        public int OwnerId { get; set; }
        public int AccessorId { get; set; }
        public DateTime AuthorizedDate { get; set ; }

        public bool IsAuthorized { get; set; }
        public int FileInformationId { get; set; }

        public virtual FileInformation FileInformation { get; set; }
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
