namespace WebData.Models
{
    public class Message : Identity
    {
        public DateTime SentDate { get; set; }
        public string MessageHash { get; set; } = string.Empty;
        public Guid SentBy { get; set; }
        public Guid ConversationId { get; set; }
        public bool IsFile { get; set; }
        
        public virtual Conversation Conversation { get; set; }

    }

    public class Conversation : Identity
    {
        public DateTime CreatedDate { get; set; }
        public Guid DoctorId { get; set; }
        public Guid PatientId { get; set; }

        public virtual Patient Patient { get; set; }
        public virtual Doctor Doctor { get; set; }
        public virtual IEnumerable<Message> Messages { get; set; }
    }
}
