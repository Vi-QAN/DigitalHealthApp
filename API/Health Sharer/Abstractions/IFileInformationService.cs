using HealthSharer.Models;
using WebData.Models;

namespace HealthSharer.Abstractions
{
    public interface IFileInformationService
    {
        GetInformationResponse AddInformation(AddInformationRequest addInformationRequest);
        IEnumerable<int> AddAllInformation(List<AddInformationRequest> informationList);
        List<GetAllInformationResponse> GetAllInformationByAccessor(int userId);
        List<GetInformationResponse> GetAllInformationByOwner(int userId);
        List<FileInformation> GetAllInformation();
        GetFileActionResponse GetFileAction(int id);
        GetInformationResponse GetInformationById(int id);
        GetInformationResponse GetInformationByHash(int userId,  string hash);

        List<GetFileNoteResponse> GetFileNotes(string fileHash, string userKey);
        Task<GetFileNoteResponse> AddFileNote(List<IFormFile> attachments, List<string> atttachmentHashes, AddFileNoteRequest request, string fileHash);
        Task<GetRegularFileResponse> GetAttachment(string fileHash, int noteId, int attachmentId);

    }
}
