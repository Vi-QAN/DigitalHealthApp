namespace HealthSharer.Models
{
    public class GetAllInformationResponse
    {
        public int OwnerId { get; set; }
        public string Key { get; set; }
        public bool IsAuthorized { get; set; }
        public string? UserName { get; set; }
        public List<GetInformationResponse> InformationList { get; set; }
    }

    public class GetInformationResponse
    {
        public string FileHash { get; set; }
        public string MultiAddress { get; set; }
        public string FileName { get; set; }
        public string FileExtension { get; set; }
        public string FileType { get; set; }
    }

    /*public class GetMessageResponse
    {
        public Guid MessageId { get; set; }
        public bool IsFile { get; set; }
        public string Content { get; set; }
        public Guid SentBy { get; set; }
    }*/
}
