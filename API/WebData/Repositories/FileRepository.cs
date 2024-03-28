using Microsoft.EntityFrameworkCore;
using WebData.Abstractions;
using WebData.Models;

namespace WebData.Repositories
{
    public class FileRepository : IFileRepository
    {
        private readonly DigitalHealthContext _context;

        public FileRepository(DigitalHealthContext context)
        {
            _context = context;
        }

        public void AddAllInformation(IEnumerable<FileInformation> information)
        {
            _context.FileInformation.AddRange(information);
        }

        public void AddInformation(FileInformation information)
        {
            _context.FileInformation.Add(information);
        }

        public void DeleteInformation(FileInformation information)
        {
            _context.FileInformation.Remove(information);
        }

        public IQueryable<FileInformation> GetAllInformation()
        {
            return _context.FileInformation;
        }

        public IQueryable<FileInformation> GetAllInformationByUser(int userId)
        {
            return _context.FileInformation.Where(i => i.OwnerId == userId);
        }

        public FileInformation GetInformation(int userId, string fileHash)
        {
            return _context.FileInformation.AsQueryable()
                .Include(x => x.FileMode)
                    .ThenInclude(m => m.AvailableActions)
                .FirstOrDefault(i => i.OwnerId == userId && i.FileHash == fileHash);
        }

        public void SaveChanges()
        {
            _context.SaveChanges();
        }

        public async Task SaveChangesAsync()
        {
            await _context.SaveChangesAsync();
        }

        public IQueryable<AvailableAction> GetAllAvailableActions()
        {
            return _context.AvailableActions;
        }

        public FileAction GetFileAction(int id)
        {
            return _context.FileActions.FirstOrDefault(fa => fa.Id == id);
        }

        public FileAction GetFileAction(string name)
        {
            return _context.FileActions.FirstOrDefault(fa => fa.Name == name);
        }

        public Models.FileMode GetFileMode(string name)
        {
            return _context.FileModes.FirstOrDefault(fa => fa.Name == name);

        }

        public FileInformation GetInformation(int fileId)
        {
            return _context.FileInformation
                    .Include(i => i.FileMode)
                        .ThenInclude(m => m.AvailableActions)
                        .ThenInclude(a => a.FileAction)
                    .FirstOrDefault(f => f.Id == fileId);
        }

        public FileNote GetNote(int noteId)
        {
            return _context.FileNotes.FirstOrDefault(n => n.Id == noteId);
        }

        public IQueryable<FileNote> GetNotesByFile(int fileId)
        {
            return _context.FileNotes.Where(n => n.FileInformationId == fileId);
        }

        public void AddNote(FileNote note)
        {
            _context.FileNotes.Add(note);
        }

        public void UpdateNote(FileNote note)
        {
            _context.FileNotes.Update(note);
        }

        public void DeleteNote(FileNote note)
        {
            _context.FileNotes.Remove(note);
        }

        public FileNoteAttachment GetAttachment(int attachmentId)
        {
            return _context.FileNoteAttachments
                    .Include(a => a.Note)
                        .ThenInclude(n => n.FileInformation)
                    .FirstOrDefault(a => a.Id == attachmentId);
        }

        public void AddAttachments(IEnumerable<FileNoteAttachment> attachments)
        {
            _context.FileNoteAttachments.AddRange(attachments);
        }

        public List<Models.FileMode> GetFileModes()
        {
            return _context.FileModes
                    .Include(m => m.AvailableActions)
                        .ThenInclude(a => a.FileAction)
                   .ToList();
        }

        public List<FilesSummary> GetFilesSummaries (int userId)
        {
            return _context.FilesSummaries.Where(s => s.OwnerId == userId).ToList();
        }

        public void AddFilesSummary(FilesSummary filesSummary)
        {
            _context.FilesSummaries.Add(filesSummary);
        }
    }
}
