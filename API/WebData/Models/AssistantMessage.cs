namespace WebData.Models
{
    public class AssistantMessage : Identity
    {
        public string From { get; set; }
        public DateTime CreatedDate { get; set; }
        public string Content { get; set; }
        public int OwnerId { get; set; }

        public virtual User Owner { get; set; }
    }
}
