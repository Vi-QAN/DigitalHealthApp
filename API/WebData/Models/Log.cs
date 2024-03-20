namespace WebData.Models
{
    public class Notification : Identity
    {
        public bool IsRead { get; set; }
        public DateTime CreatedDate { get; set; }
        public int LogId { get; set; }
        public int RecipientId { get; set; }

        public virtual ActionLog ActionLog { get; set; }
        public virtual User Recipient { get; set; }
    }

    public class ActionLog : Identity
    {
        public int FileActionId { get; set; }
        public int UserId { get; set; }
        public DateTime AddedDate { get; set; }
        public int InformationId { get; set; }

        public virtual FileAction FileAction { get; set; }
        public virtual User User { get; set; }
        public virtual FileInformation FileInformation { get; set; }
        public virtual IEnumerable<Notification> Notifications { get; set; }
    }
}
