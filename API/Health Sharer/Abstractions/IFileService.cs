using HealthSharer.Models;

namespace HealthSharer.Abstractions
{
    public interface IFileService
    {
        void uploadFile(IFormFile file, GetUserResponse user);
        void convertHL7(IFormFile file);
    }
}
