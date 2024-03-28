
namespace WebData.Models
{
    public class FileAction : Identity
    {
        public string Name { get; set; }

        public virtual IEnumerable<AvailableAction> AvailableActions { get; set; }
        public virtual IEnumerable<ActionLog> ActionLogs { get; set; }
    }

    public class FileMode : Identity
    {
        public string Name { get; set; }

        public virtual IEnumerable<AvailableAction>? AvailableActions { get; set; }
        public virtual IEnumerable<FileInformation>? FileInformationList { get; set; }
    }

    public class AvailableAction
    {
        public int FileActionId { get; set; }
        public int FileModeId { get; set; }

        public virtual FileAction? FileAction { get; set; }
        public virtual FileMode? FileMode { get; set; }
    }

    public class FileInformation : Identity
    {
        public DateTime AddedDate { get; set; }
        public string FileHash { get; set; }
        public string MultiAddress { get; set; }
        public int OwnerId { get; set; }
        public string FileName { get; set; }
        public string FileExtension { get; set; }
        public string FileType { get; set; }
        public int FileModeId { get; set; }

        public virtual User? Owner { get; set; }
        public virtual FileMode? FileMode { get; set;}
        public virtual IEnumerable<ActionLog> ActionLogs { get; set; }
        public virtual IEnumerable<FileAuthorizationRecord> FileAuthorizationRecords { get; set; }
        public virtual IEnumerable<FileNote> FileNotes { get; set; }
    }

    public class FileNote : Identity
    {
        public string Content { get; set; }
        public DateTime AddedDate { get; set; }
        public int UserId { get; set; }
        public int FileInformationId { get; set; }

        public virtual User User { get; set;}
        public virtual FileInformation FileInformation { get; set; }
        public virtual IEnumerable<FileNoteAttachment> Attachments { get; set; }
    }

    public class FileNoteAttachment : Identity
    {
        public string Hash { get; set; }
        public string IPFSHash { get; set; }
        public string FileName { get; set; }
        public string FileType { get; set; }
        public int NoteId { get; set; }
        
        public virtual FileNote Note { get; set; }
    }

    public class FilesSummary : Identity
    {
        public string MedicalDataSummary { get; set; }
        public string WearableDataFileSummary { get; set; }
        public string MedicalFileRange { get; set; }
        public DateTime GeneratedDate { get; set; }
        public int OwnerId { get; set; }

        public virtual User Owner { get; set; }
    };
}
