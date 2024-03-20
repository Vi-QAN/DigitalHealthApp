using HealthSharer.Models;

namespace HealthSharer.Abstractions
{
    public interface IFileService
    {
        Task uploadFiles(List<IFormFile> files, GetUserResponse owner, GetUserResponse accessor);
        Task<GetRegularFileResponse> downloadFile(string fileHash, string ownerKey, string accessorKey);
        Task uploadFromText(AddJSONFileFromTextRequest request);
        Task uploadFromText(AddPDFFileFromTextRequest request);
        Task deleteFile(int fileId);
        Task<GetRegularFileResponse> downloadFiles(List<int> fileIds, string ownerKey, string accessorKey, string fileExtension);
        Task<List<GetHL7FileResponse>> openHL7Files(List<int> fileIds, string ownerKey, string accessorKey, string fileExtension);
    }
}
