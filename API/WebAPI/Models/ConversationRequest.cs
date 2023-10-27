namespace WebAPI.Models
{
    public class ConversationRequest
    {
        public Guid DoctorId { get; set; }
        public Guid PatientId { get; set; }
    }

    public class AddConversationRequest : ConversationRequest
    {
        public Guid CreatedBy { get; set; }
        public string Message { get; set; }
        public bool IsFile { get; set; }
        public File? File { get; set; }
    }

    public class DeleteConversationRequest
    {
        public Guid ConversationId { get; set; }
    }

    public class MessageRequest
    {
        public Guid SentBy { get; set; }
        public string Content { get; set; }
        public bool IsFile { get; set; }
        public File? File { get; set; }
    }

    public class AddMessageRequest : MessageRequest 
    {

    }

    public class File
    {
        public string OriginalFileName { get; set; }
        public string NewFileName { get; set; }
    }
}
