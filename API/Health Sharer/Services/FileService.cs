using HealthSharer.Abstractions;
using HealthSharer.Models;

namespace HealthSharer.Services
{
    public class FileService : IFileService
    {
        private readonly IContractService _contractService;
        private readonly IInformationService _informationService;

        public FileService(IContractService contractService, IInformationService informationService)
        {
            _contractService = contractService;
            _informationService = informationService;
        }
        public void convertHL7(IFormFile file)
        {
            throw new NotImplementedException();
        }

        public void uploadFile(IFormFile file)
        {

        }

        public async Task uploadFiles(List<IFormFile> files, GetUserResponse owner, GetUserResponse accessor) {

            
            var key = await _contractService.GetKey(owner.Key, accessor.Key);
            
            
            


        }
    }
}
