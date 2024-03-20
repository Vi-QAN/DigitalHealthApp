using WebData.Models;
using FileMode = WebData.Models.FileMode;

namespace WebData.Abstractions
{
    public interface IFileRepository : IBaseRepository
    {
        void AddInformation(FileInformation information);
        void AddAllInformation(IEnumerable<FileInformation> information);
        void DeleteInformation(FileInformation information);
        IQueryable<FileInformation> GetAllInformationByUser(int userId);
        IQueryable<FileInformation> GetAllInformation();
        FileInformation GetInformation(int userId, string fileHash);
        FileInformation GetInformation(int fileId);
        
        IQueryable<AvailableAction> GetAllAvailableActions();
        FileAction GetFileAction(int id);
        FileAction GetFileAction(string name);
        FileMode GetFileMode(string name);

        FileNote GetNote(int noteId);
        IQueryable<FileNote> GetNotesByFile(int fileId);
        void AddNote(FileNote note);
        void UpdateNote(FileNote note);
        void DeleteNote(FileNote note);

        FileNoteAttachment GetAttachment(int attachmentId);
        void AddAttachments(IEnumerable<FileNoteAttachment> attachments);
    }
}
