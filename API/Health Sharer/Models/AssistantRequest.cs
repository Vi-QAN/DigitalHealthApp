namespace HealthSharer.Models
{
    public class AssistantRequest
    {
        public int OwnerId { get; set; }
        public string UserMessage { get; set; }
    }

    public class DetectionRequest
    {
        public string Field { get; set; }
        public int Value { get; set; }
        public bool IsGreaterThanNormal { get; set; }
    }

    public class AssistantResponse
    {
        public int MessageId { get; set; }
        public string MessageContent { get; set; }
        public string From { get; set; }
        public DateTime CreatedDate { get; set; }
    }
}
