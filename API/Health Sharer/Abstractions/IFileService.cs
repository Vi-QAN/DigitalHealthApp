using HealthSharer.Models;

namespace HealthSharer.Abstractions
{
    public interface IFileService
    {
        Task uploadFiles(List<IFormFile> files, GetUserResponse owner, GetUserResponse accessor);
        void uploadFile(IFormFile file);
        void convertHL7(IFormFile file);
    }
}
