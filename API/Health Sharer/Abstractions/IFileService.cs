using HealthSharer.Models;

namespace HealthSharer.Abstractions
{
    public interface IFileService
    {
        Task<List<GetInformationResponse>> uploadFiles(List<IFormFile> files, GetUserResponse owner, GetUserResponse accessor);
        Task<GetRegularFileResponse> downloadFile(string fileHash, string ownerKey, string accessorKey);
        Task<GetInformationResponse> uploadFromText(AddJSONFileFromTextRequest request);
        Task<GetInformationResponse> uploadFromText(AddPDFFileFromTextRequest request);
        Task deleteFile(int fileId);
        Task<GetRegularFileResponse> downloadFiles(List<int> fileIds, string ownerKey, string accessorKey, string fileExtension);
        Task<List<GetHL7FileResponse>> openHL7Files(List<int> fileIds, string ownerKey, string accessorKey, string fileExtension);

        List<GetFilesSummaryResponse> getFilesSummaries(int ownerId);
        Task<GetFilesSummaryResponse> summarizeFiles(List<int> fileIds = null, string ownerKey = null, string accessorKey = null);
    }
}
