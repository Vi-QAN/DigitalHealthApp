using Azure;
using Gehtsoft.PDFFlow.Builder;
using Gehtsoft.PDFFlow.Models.Enumerations;
using HealthSharer.Abstractions;
using HealthSharer.Exceptions;
using HealthSharer.Extensions;
using HealthSharer.Models;
using Newtonsoft.Json;
using System.IO;
using System.IO.Compression;
using System.Net.Http;
using System.Text;
using WebData.Abstractions;

namespace HealthSharer.Services
{
    public class FileService : IFileService
    {
        private readonly IContractService _contractService;
        private readonly IFileInformationService _informationService;
        private readonly IUserService _userService;
        private readonly ILogService _logService;
        private readonly IFileRepository _fileRepository;
        public HttpClient _httpClient { get; set; } = new HttpClient();

        private const string IPFSBaseUrl = "http://127.0.0.1:5001/api/v0";
        private const string IPFSAddUrl = IPFSBaseUrl + "/add";
        private const string IPFSGetUrl = IPFSBaseUrl + "/cat?arg=";
        private const string IPFSDeleteUrl = IPFSBaseUrl + "/files/rm?arg=";
        private HL7ConversionService hl7Service = new HL7ConversionService();

        public FileService(
            IContractService contractService,
            IFileInformationService informationService,
            IUserService userService,
            ILogService logService,
            IFileRepository fileRepository
            )
        {
            _contractService = contractService;
            _informationService = informationService;
            _userService = userService;
            _logService = logService;
            _fileRepository = fileRepository;
        }

        #region
        private async Task<List<GetRegularFileResponse>> downloadFiles(List<int> fileIds, RandomSeed seed, string fileExtension, int userId)
        {
            List<GetRegularFileResponse> responses = new List<GetRegularFileResponse>();

            var fileInfoList = _informationService.GetAllInformationByOwner(userId)
                .Where(f => f.FileExtension == fileExtension)
                .ToList();

            foreach (int id in fileIds)
            {
                var fileInfo = fileInfoList.FirstOrDefault(f => f.FileId == id);

                if (fileInfo == default)
                {
                    throw new NotFoundException("File Not Found");
                }

                responses.Add(await downloadFile(fileInfo, seed));
            }

            return responses;
        }

        public async Task<GetRegularFileResponse> downloadFiles(List<int> fileIds, string ownerKey, string accessorKey, string fileExtension)
        {
            var owner = _userService.GetUser(ownerKey);

            if (owner == default) throw new NotFoundException("User Not Found");

            var seed = await _contractService.GetKey(ownerKey, accessorKey);

            var files = await downloadFiles(fileIds, seed, fileExtension, owner.UserId);

            var zipName = $"archive-{DateTime.Now.ToString("yyyy_MM_dd-HH_mm_ss")}.zip";

            using (var memoryStream = new MemoryStream())
            {
                using (var archive = new ZipArchive(memoryStream, ZipArchiveMode.Create, true))
                {
                    files.ForEach(file =>
                    {
                        var currentFile = archive.CreateEntry(file.FileName, CompressionLevel.Optimal);
                        using (var streamWriter = new StreamWriter(currentFile.Open()))
                        {
                            streamWriter.Write(file.Content);
                        }
                    });
                }

                return new GetRegularFileResponse()
                {
                    FileName = zipName,
                    Content = memoryStream.ToArray(),
                    ContentType = "application/zip"
                };
            }
        }

        public async Task<GetRegularFileResponse> downloadFile(string fileHash, string ownerKey, string accessorKey)
        {
            var owner = _userService.GetUser(ownerKey);
            var accessor = _userService.GetUser(accessorKey);
            
            if (owner == default) throw new NotFoundException("User Not Found");
            if (accessor == default) throw new NotFoundException("User Not Found");

            var seed = await _contractService.GetKey(owner.Key, accessor.Key);

            var file = _informationService.GetInformationByHash(owner.UserId, fileHash);

            return await downloadFile(file, seed);
        }

        private async Task<GetRegularFileResponse> downloadFile(GetInformationResponse fileInfo, RandomSeed seed)
        {
            string apiUrl = IPFSGetUrl + fileInfo.FileHash;

            HttpResponseMessage response = await _httpClient.PostAsync(apiUrl, null);

            if (response.IsSuccessStatusCode)
            {
                var fileContent = await response.Content.ReadAsByteArrayAsync();

                if (fileInfo.FileMode == "Private")
                {
                    try
                    {
                        fileContent = await CryptographicService.DecryptFile(fileContent, seed.iv, seed.key);
                    }
                    catch (Exception ex)
                    {
                        Console.WriteLine(ex);
                    }
                }

                return new GetRegularFileResponse()
                {
                    Content = fileContent,
                    ContentType = fileInfo.FileType,
                    FileName = fileInfo.FileName + '.' + fileInfo.FileExtension,
                };
            }
            else
            {
                throw new Exception($"Failed to fetch file from IPFS. Status code: {response.StatusCode}");
            }
            
        }
        #endregion

        #region
        private async Task<string> uploadFile(byte[] encrypted)
        {
            // Create a ByteArrayContent with the encrypted data
            var content = new ByteArrayContent(encrypted);


            using (var formData = new MultipartFormDataContent())
            {
                // Add the encrypted content to the form data
                formData.Add(content, "file");

                // Send the encrypted file to IPFS
                try
                {
                    var response = await _httpClient.PostAsync(IPFSAddUrl, formData);
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
                    MultiAddress = "/ip4/127.0.0.1/tcp/5001"
                });

            };

            var infoIds = _informationService.AddAllInformation(informationList);
            var fileAction = _fileRepository.GetFileAction("Upload");
            _logService.AddActionLogs(fileAction.Id, accessor.UserId, infoIds);
        }

        public async Task uploadFromText(AddJSONFileFromTextRequest request)
        {
            var user = _userService.GetUser(request.OwnerId);
            var seed = await _contractService.GetKey(user.Key, user.Key);
            var contentStr = request.Content.Serialize();
            var contentBytes = Encoding.ASCII.GetBytes(contentStr);
            contentBytes = await CryptographicService.EncryptFile(contentBytes, seed.iv, seed.key);

            var fromDate = request.Content.ElementAt(0).DateTime.ToString();
            var toDate = request.Content.ElementAt(request.Content.Count - 1).DateTime.ToString();

            var fileName = $"Wearable_Data_{user.UserId}_from_{fromDate}_to_{toDate}.json";

            var fileHash = await uploadFile(contentBytes);

            var informationList = new List<AddInformationRequest>()
                {
                    new AddInformationRequest() {
                        OwnerId = user.UserId,
                        FileName = fileName,
                        FileHash = fileHash,
                        FileType = "application/json",
                        MultiAddress = "/ip4/127.0.0.1/tcp/5001",

                    }
                };

            var infoIds = _informationService.AddAllInformation(informationList);
            var fileAction = _fileRepository.GetFileAction("Upload");
            _logService.AddActionLogs(fileAction.Id, user.UserId, infoIds);
        }

        public async Task uploadFromText(AddPDFFileFromTextRequest request)
        {
            var section = SectionBuilder.New();
            var document = DocumentBuilder.New();

            var user = _userService.GetUser(request.OwnerId);

            var seed = await _contractService.GetKey(user.Key, user.Key);

            var currentDate = DateTime.UtcNow;

            using (var memoryStream = new MemoryStream())
            {
                var fileName = $"Medical_Request_{user.Name}_{currentDate.ToFileTimeUtc()}.pdf";

                document.PrepareDocument();
                section.AddTitle();
                section.AddProviderSection(request.Content.Provider);
                section.AddPatientSection(request.Content.Patient);
                section.AddRequestedDocuments(request.Content.RequestedDocuments);
                document.AddSection(section)
                    .SetOrientation(PageOrientation.Portrait)
                    .SetSize(PaperSize.A4)
                    .ToDocument().Build(memoryStream);

                var content = memoryStream.ToArray();

                content = await CryptographicService.EncryptFile(content, seed.iv, seed.key);

                var fileHash = await uploadFile(content);

                var informationList = new List<AddInformationRequest>()
                {
                    new AddInformationRequest() {
                        OwnerId = user.UserId,
                        FileName = fileName,
                        FileHash = fileHash,
                        FileType = "application/pdf",
                        MultiAddress = "/ip4/127.0.0.1/tcp/5001"
                    }
                };

                var infoIds = _informationService.AddAllInformation(informationList);
                var fileAction = _fileRepository.GetFileAction("Upload");
                _logService.AddActionLogs(fileAction.Id, user.UserId, infoIds);

            }
        }

        #endregion

        #region
        public async Task deleteFile(int fileId)
        {
            var fileInfo = _fileRepository.GetInformation(fileId);

            if (fileInfo == default)
            {
                throw new NotFoundException("File Not Found");
            }

            string apiUrl = IPFSDeleteUrl + fileInfo.FileHash;

            HttpResponseMessage response = await _httpClient.PostAsync(apiUrl, null);

            if (response.IsSuccessStatusCode)
            {
                _fileRepository.DeleteInformation(fileInfo);
                _fileRepository.SaveChanges();
            }
            else
            {
                throw new Exception($"Failed to delete file from IPFS. Status code: {response.StatusCode}");
            }
        }
        #endregion


        #region
        private async Task<GetHL7FileResponse> convertHL7(byte[] data)
        {
            // Convert byte array to string using ASCII encoding
            string decoded = Encoding.ASCII.GetString(data);

            hl7Service.Message = decoded;

            GetHL7FileResponse result;
            switch (hl7Service.FileVersion)
            {
                case "2.4":
                    result = hl7Service.ProcessHL7v24Message(decoded);
                    break;
                case "2.8.1":
                    result = hl7Service.ProcessHL7v281Message(decoded);
                    break;
                default:
                    throw new Exception("Message is not set");
            }

            if (result == null)
            {
                throw new Exception("Fail to convert HL7");
            }

            return result;
        }

        public async Task<List<GetHL7FileResponse>> openHL7Files(List<int> fileIds, string ownerKey, string accessorKey, string fileExtension)
        {
            var owner = _userService.GetUser(ownerKey);
            if (owner == default) throw new NotFoundException("User Not Found");

            var seed = await _contractService.GetKey(ownerKey, accessorKey);

            var files = await downloadFiles(fileIds, seed, fileExtension, owner.UserId);

            List<GetHL7FileResponse> result = new List<GetHL7FileResponse>();

            foreach (var file in files)
            {
                try
                {
                    var converted = await convertHL7(file.Content);
                    converted.FileName = file.FileName;
                    converted.ContentType = file.ContentType;
                    result.Add(converted);
                } catch(Exception ex) {
                    Console.WriteLine(ex);
                }
            }

            return result;
        }
    }
    #endregion
}
