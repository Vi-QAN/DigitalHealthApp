using Org.BouncyCastle.Asn1.Crmf;

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
        public int FileId { get; set; }
        public string FileHash { get; set; }
        public string MultiAddress { get; set; }
        public string FileName { get; set; }
        public string FileExtension { get; set; }
        public string FileType { get; set; }
        public string FileMode { get; set; }
        public DateTime AddedDate { get; set; }
        public List<GetFileActionResponse>? FileActions { get; set; }
    }

    public class GetFileActionResponse
    {
        public int Id { get; set; }
        public string Name { get; set; } 
    }

    public class GetFileNoteResponse
    {
        public int NoteId { get; set; }
        public int UserId { get; set; }
        public string UserKey { get; set; }
        public string Username { get; set; }
        public string Content { get; set; }
        public DateTime AddedDate { get; set; }
        public List<GetAttachmentResponse> Attachments { get; set; }
    }
    
    public class GetAttachmentResponse
    {
        public int AttachmentId { get; set; }
        public string AttachmentHash { get; set; }
    }
}
