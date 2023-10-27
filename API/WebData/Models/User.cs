
namespace WebData.Models
{
    public class User : Identity
    {
        public string Name { get; set; }
        public string Address { get; set; }
        public string? Phone { get; set; }
        public Guid UserId { get; set; }
        
        
        public virtual IEnumerable<Conversation> Conversations { get; set; } 
    }

    public class Patient : User { 
        public int Age { get; set; }
        public int Sex { get; set; }
        public DateTime RegistrationDate { get; set; }

        public virtual Device Device { get; set; }
    }

    public class Doctor : User { 
    
    }
}
