namespace WebAPI.Models
{
    public class ConversationResponse
    {
        public Guid Id { get; set; }
        public string DoctorName { get; set; }
        public string PatientName { get; set; }
        public GetMessageResponse LatestMessage { get; set; }
    }

    public class GetMessageResponse
    {
        public Guid MessageId { get; set; }
        public bool IsFile { get; set; }
        public string Content { get; set; }
        public Guid SentBy { get; set; }
    }
}
