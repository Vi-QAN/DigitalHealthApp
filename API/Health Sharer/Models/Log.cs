namespace HealthSharer.Models
{
    public class AddNotificationRequest
    {
        public int NotificationId { get; set; }
        public int Recipientid { get; set; }
    }

    public class UpdateNotificationRequest : AddNotificationRequest { }

    public class GetNotificationResponse
    {
        public int Id { get; set; }
        public string AccessorName { get; set; }
        public string FileName { get; set; }
        public string FileExtension { get; set; }
        public string ActionName { get; set; }
        public bool IsRead { get; set; }
        public DateTime CreatedDate { get; set; }
    }
}
