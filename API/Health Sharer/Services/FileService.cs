using HealthSharer.Abstractions;
using HealthSharer.Models;

namespace HealthSharer.Services
{
    public class FileService : IFileService
    {
        private readonly IContractService _contractService;
        public FileService(IContractService contractService)
        {
            _contractService = contractService;
        }
        public void convertHL7(IFormFile file)
        {
            throw new NotImplementedException();
        }

        public void uploadFile(IFormFile file, GetUserResponse user)
        {

            //_contractService.GetKey()
        }
    }
}
