namespace HealthSharer.Models
{
    public class AddInformationRequest
    {
        public string FileHash { get; set; }
        public string MultiAddress { get; set; }
        public string FileName { get; set; }
        public string FileType { get; set; }
        public int UserId { get; set; }
    }

    public class GetInformationRequest
    {
        public int UserId { get; set; }
    }
    /*public class ConversationRequest
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
    }*/
}
