using HealthSharer.Models;

namespace HealthSharer.Abstractions
{
    public interface IFileService
    {
        Task uploadFiles(List<IFormFile> files, GetUserResponse owner, GetUserResponse accessor);
        Task<GetFileResponse> downloadFile(string fileHash, string owner, string accessor);
    }
}
