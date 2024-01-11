using HealthSharer.Abstractions;
using HealthSharer.Exceptions;
using HealthSharer.Models;
using Newtonsoft.Json;
using WebData.Abstractions;
using WebData.Models;

namespace HealthSharer.Services
{
    public class FileService : IFileService
    {
        private readonly IContractService _contractService;
        private readonly IInformationService _informationService;
        private readonly IUserService _userService;

        private const string IPFSBaseUrl = "http://127.0.0.1:5001/api/v0";
        private const string IPFSAddUrl = IPFSBaseUrl + "/add";
        private const string IPFSGetUrl = IPFSBaseUrl + "/cat?arg=";

        public FileService(IContractService contractService, IInformationService informationService, IUserService userService)
        {
            _contractService = contractService;
            _informationService = informationService;
            _userService = userService;
        }
        public void convertHL7(IFormFile file)
        {
            throw new NotImplementedException();
        }

        private async Task<byte[]> downloadFile(string fileHash)
        {
            string apiUrl = IPFSGetUrl + fileHash;

            using (HttpClient httpClient = new HttpClient())
            {
                HttpResponseMessage response = await httpClient.PostAsync(apiUrl, null);

                if (response.IsSuccessStatusCode)
                {
                    return await response.Content.ReadAsByteArrayAsync();
                }
                else
                {
                    throw new Exception($"Failed to fetch file from IPFS. Status code: {response.StatusCode}");
                }
            }
        }

        public async Task<GetFileResponse> downloadFile(string fileHash, string ownerKey, string accessorKey)
        {
            var owner = _userService.GetUser(ownerKey);
            if (owner == default) throw new NotFoundException("User Not Found");

            var seed = await _contractService.GetKey(ownerKey, accessorKey);

            var files = _informationService.GetAllInformationByOwner(owner.UserId);
            var fileInfo = files.FirstOrDefault(f => f.FileHash == fileHash);

            if (fileInfo == default) {
                throw new NotFoundException("File Not Found");
            }

            var file = await downloadFile(fileInfo.FileHash);
            try
            {
                var decrypted = await CryptographicService.DecryptFile(file, seed.iv, seed.key);

                return new GetFileResponse()
                {
                    Content = decrypted,
                    ContentType = fileInfo.FileType,
                    FileName = fileInfo.FileName + '.' + fileInfo.FileExtension,
                };
            } catch (Exception ex)
            {

            }
            return null;
            
        }

        private async Task<string> uploadFile(byte[] encrypted)
        {
            // Create a ByteArrayContent with the encrypted data
            var content = new ByteArrayContent(encrypted);
            

            using (var httpClient = new HttpClient())
            using (var formData = new MultipartFormDataContent())
            {
                // Add the encrypted content to the form data
                formData.Add(content, "file");

                // Send the encrypted file to IPFS
                try
                {
                    var response = await httpClient.PostAsync(IPFSAddUrl, formData);
                    if (response.IsSuccessStatusCode)
                    {
                        // Parse the IPFS response to get the hash of the uploaded file
                        var responseContent = await response.Content.ReadAsStringAsync();
                        var data = JsonConvert.DeserializeObject<IPFSAddResponse>(responseContent);
                        return data.Hash;
                    }
                    else
                    {
                        throw new Exception($"IPFS upload failed. Status code: {response.StatusCode}");
                    }
                }
                catch (Exception ex)
                {
                   throw ex;
                }
            }
        }

        public async Task uploadFiles(List<IFormFile> files, GetUserResponse owner, GetUserResponse accessor) {

            var seed = await _contractService.GetKey(owner.Key, accessor.Key);
            var informationList = new List<AddInformationRequest>();

            foreach (var file in files)
            {
                var encrypted = await CryptographicService.EncryptFile(file, seed.iv, seed.key);

                var fileHash = await uploadFile(encrypted);

                informationList.Add(new AddInformationRequest()
                {
                    OwnerId = owner.UserId,
                    FileName = file.FileName,
                    FileHash = fileHash,
                    FileType = file.ContentType,
                    MultiAddress = "/ip4/127.0.0.1/tcp/5001",
                });
                
            };

            
            _informationService.AddAllInformation(informationList);



        }
    }
}
