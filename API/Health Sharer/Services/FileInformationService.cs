using HealthSharer.Abstractions;
using HealthSharer.Exceptions;
using HealthSharer.Models;
using WebData.Models;
using WebData.Abstractions;
using WebData.Repositories;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;
using Microsoft.VisualBasic;
using System.IO;
using Newtonsoft.Json;
using System.Security.Cryptography;
using System.Security.Policy;
using Org.BouncyCastle.Crypto.Prng;

namespace HealthSharer.Services
{
    public class FileInformationService : IFileInformationService
    {
        private readonly IUserService _userService;
        private readonly IFileRepository _fileRepository;
        private readonly IAuthorizationService _authorizationService;
        private readonly ILogger _logger;
        public HttpClient _httpClient { get; set; } = new HttpClient();

        private static string IPFSBaseUrl = $"{Environment.GetEnvironmentVariable("IPFS_CONNECTION")}";
        private string IPFSAddUrl = IPFSBaseUrl + "/add";
        private string IPFSGetUrl = IPFSBaseUrl + "/cat?arg=";

        public FileInformationService(
            IUserService userService, 
            IFileRepository fileRepository, 
            IAuthorizationService authorizationService,
            ILogger<FileInformationService> logger)
        {
            _userService = userService;
            _fileRepository = fileRepository;
            _authorizationService = authorizationService;
            _logger = logger;
        }

        public GetInformationResponse AddInformation(AddInformationRequest addInformationRequest)
        {
            var user = _userService.GetUser(addInformationRequest.OwnerId);
            if (user == default) {
                throw new NotFoundException("User not found");
            }

            var information = _fileRepository.GetInformation(addInformationRequest.OwnerId, addInformationRequest.FileHash);

            if (information != default) {
                throw new BadRequestException("Information existed");
            }

            var fileMode = _fileRepository.GetFileMode("Public");

            var newInformation = new FileInformation()
            {
                OwnerId = addInformationRequest.OwnerId,
                FileHash = addInformationRequest.FileHash,  
                MultiAddress = addInformationRequest.MultiAddress,
                FileName = addInformationRequest.FileName.Split('.')[0],
                FileExtension = addInformationRequest.FileName.Split('.')[1],
                FileType = addInformationRequest.FileType,
                FileModeId = fileMode.Id,
                AddedDate = DateTime.UtcNow,
            };

            _fileRepository.AddInformation(newInformation);
            _fileRepository.SaveChanges();

            return new GetInformationResponse()
            {
                FileId = newInformation.Id,
                FileName = newInformation.FileName,
                FileExtension = newInformation.FileExtension,
                FileHash = newInformation.FileHash,
                MultiAddress = newInformation.MultiAddress,
            };
            
        }

        public List<GetInformationResponse> GetAllInformationByOwner(int userId)
        {
            var user = _userService.GetUser(userId);
            if (user == default)
            {
                throw new NotFoundException("User not found");
            }

            var information = _fileRepository.GetAllInformation()
                .Where(i => i.OwnerId == userId)
                .Include(x => x.FileMode)
                    .ThenInclude(x => x.AvailableActions)
                        .ThenInclude(x => x.FileAction);


            return information.Select(i => new GetInformationResponse()
            {
                FileId = i.Id,
                FileExtension = i.FileExtension,
                FileName = i.FileName,
                FileHash = i.FileHash,
                FileType = i.FileType,
                FileMode = i.FileMode.Name,
                AddedDate = i.AddedDate,
                FileActions = i.FileMode.AvailableActions.Select(a => new GetFileActionResponse()
                {
                    Id = a.FileAction.Id,
                    Name = a.FileAction.Name,
                }).ToList()
            }).OrderBy(x => x.AddedDate).ToList();
        }

        public List<GetAllInformationResponse> GetAllInformationByAccessor(int userId)
        {
            var user = _userService.GetUser(userId);

            if (user == default)
            {
                throw new NotFoundException("User not found");
            }

            var information = _fileRepository.GetAllInformation()
                .Include(x => x.FileMode)
                    .ThenInclude(x => x.AvailableActions)
                        .ThenInclude(x => x.FileAction); 

            var records = _authorizationService.GetAuthorizationRecordsByAccessor(userId);

            return records.GroupJoin(
                information,
                record => record.OwnerId,
                info => info.OwnerId,
                (record, info) => new GetAllInformationResponse()
                {
                    OwnerId = record.OwnerId,
                    IsAuthorized = record.IsAuthorized,
                    InformationList = info.Select(i => new GetInformationResponse()
                    {   
                        FileId = i.Id,
                        MultiAddress = i.MultiAddress,
                        FileName = i.FileName,
                        FileHash = i.FileHash,
                        FileExtension = i.FileExtension,
                        FileType = i.FileType,
                        FileMode = i.FileMode.Name,
                        AddedDate = i.AddedDate,
                        FileActions = i.FileMode.AvailableActions.Select(a => new GetFileActionResponse()
                        {
                            Id = a.FileAction.Id,
                            Name = a.FileAction.Name,
                        }).ToList(),
                    }).ToList(),
                    Key = record.Key,
                    UserName = record.UserName,
                }).ToList();

        }

        public List<FileInformation> AddAllInformation(List<AddInformationRequest> requests)
        {
            var user = _userService.GetUser(requests[0].OwnerId);
            if (user == default)
            {
                throw new NotFoundException("User not found");
            }

            var fileMode = _fileRepository.GetFileMode("Private");

            var list = requests.Select(request => new FileInformation()
            {
                OwnerId = request.OwnerId,
                FileHash = request.FileHash,
                MultiAddress = request.MultiAddress,
                FileName = request.FileName.Split('.')[0],
                FileExtension = request.FileName.Split('.')[1],
                FileType = request.FileType,
                FileModeId = fileMode.Id,
                AddedDate = DateTime.UtcNow
            }).ToList();

            _fileRepository.AddAllInformation(list);
            _fileRepository.SaveChanges();

            return list;
        }

        public GetFileActionResponse GetFileAction(int id)
        {
            return new GetFileActionResponse() { Id = id };
        }

        public GetInformationResponse GetInformationById(int id)
        {
            var fileInfo = _fileRepository.GetInformation(id);

            if (fileInfo == null)
            {
                throw new NotFoundException("File Information Not Found");
            }

            return new GetInformationResponse()
            {
                FileId = fileInfo.Id,
                FileExtension = fileInfo.FileExtension,
                FileName = fileInfo.FileName,
                FileHash = fileInfo.FileHash,
                FileType = fileInfo.FileType,
                FileMode = fileInfo.FileMode.Name,
                AddedDate = fileInfo.AddedDate,
                FileActions = fileInfo.FileMode.AvailableActions.Select(a => new GetFileActionResponse()
                {
                    Id = a.FileAction.Id,
                    Name = a.FileAction.Name,
                }).ToList(),
            };
        }

        public GetInformationResponse GetInformationByHash(int userId, string hash)
        {
            var fileInfo = _fileRepository.GetInformation(userId, hash);

            if (fileInfo == null)
            {
                throw new NotFoundException("File Information Not Found");
            }

            return new GetInformationResponse()
            {
                FileId = fileInfo.Id,
                FileExtension = fileInfo.FileExtension,
                FileName = fileInfo.FileName,
                FileHash = fileInfo.FileHash,
                FileMode = fileInfo.FileMode.Name,
                FileType = fileInfo.FileType,
                AddedDate = fileInfo.AddedDate,                
            };
        }

        public List<FileInformation> GetAllInformation()
        {
            return _fileRepository.GetAllInformation()
                .Include(x => x.FileMode).ToList();
        }

        public List<GetFileNoteResponse> GetFileNotes(string fileHash, string ownerKey)
        {
            var owner = _userService.GetUser(ownerKey);
            var file = _fileRepository.GetInformation(owner.UserId, fileHash);

            if (file == null)
                throw new NotFoundException("File doesn't exist");

            var notes = _fileRepository.GetNotesByFile(file.Id)
                .Include(x => x.User)
                .Include(x => x.Attachments);

            return notes.Select(x => new GetFileNoteResponse()
            {
                NoteId = x.Id,
                AddedDate = x.AddedDate,
                Content = x.Content,
                UserId = x.User.Id,
                Username = x.User.Name,
                UserKey = x.User.PublicKey,
                Attachments = x.Attachments.Select(x => new GetAttachmentResponse() {
                    AttachmentId = x.Id,
                    AttachmentHash = x.Hash
                }).ToList()
            }).ToList();
        }

        public async Task<GetFileNoteResponse> AddFileNote(List<IFormFile> attachments, List<string> attachmentHashes, AddFileNoteRequest request, string fileHash)
        {
            var owner = _userService.GetUser(request.OwnerKey);
            var accessor = _userService.GetUser(request.AccessorKey);
            var file = _fileRepository.GetInformation(owner.UserId, fileHash);
            var attachmentList = new List<FileNoteAttachment>();

            if (file == null)
                throw new NotFoundException("File doesn't exist");

            for (var i = 0; i < attachments.Count; i++)
            {
                var ipfsHash = await UploadAttachment(attachments[i]);
                var newAttachment = new FileNoteAttachment()
                {
                    FileType = attachments[i].ContentType,
                    FileName = $"{accessor.UserId}_{DateTime.UtcNow.ToFileTimeUtc()}.{attachments[i].ContentType.Split("/")[1]}",
                    Hash = attachmentHashes[i],
                    IPFSHash = ipfsHash,
                };

                attachmentList.Add(newAttachment);
            }

            var newNote = new FileNote()
            {
                FileInformationId = file.Id,
                AddedDate = DateTime.UtcNow,
                UserId = accessor.UserId,
                Content = request.Content,
                Attachments = attachmentList
            };
            
            try
            {
                _fileRepository.AddNote(newNote);
                _fileRepository.SaveChanges();
            } catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
            }
            


            return new GetFileNoteResponse()
            {
                NoteId = newNote.Id,
                AddedDate = newNote.AddedDate,
                Content = newNote.Content,
                UserId = accessor.UserId,
                Username = accessor.Name,
                UserKey = accessor.Key,
                Attachments = newNote.Attachments.Select(x => new GetAttachmentResponse()
                {
                    AttachmentId = x.Id,
                    AttachmentHash = x.Hash,
                }).ToList(),
            };
        }

        private async Task<string> UploadAttachment(IFormFile file)
        {
            using (var memoryStream = new MemoryStream())
            using (var formData = new MultipartFormDataContent()) 
            { 
                await file.CopyToAsync(memoryStream);
                memoryStream.Close();
                var byteArray = memoryStream.ToArray();
                var content = new ByteArrayContent(byteArray);

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
                        _logger.LogError("Failed to upload attachment to IPFS: {status} {response} {url}", response.StatusCode, response.Content.ToString(), IPFSBaseUrl);
                        throw new Exception($"IPFS upload failed. Status code: {response.StatusCode}");
                    }
                }
                catch (Exception ex)
                {
                    throw ex;
                }
            };
        }

        public async Task<GetRegularFileResponse> GetAttachment(string fileHash, int noteId, int attachmentId)
        {
            var attachment = _fileRepository.GetAttachment(attachmentId);
            var note = attachment.Note;
            var file = note.FileInformation;

            if (attachment == null || file.FileHash != fileHash || note.Id != noteId)
                throw new NotFoundException("Attachment Not Found");

            string apiUrl = IPFSGetUrl + attachment.IPFSHash;

            HttpResponseMessage response = await _httpClient.PostAsync(apiUrl, null);

            if (response.IsSuccessStatusCode)
            {
                var fileContent = await response.Content.ReadAsByteArrayAsync();

                return new GetRegularFileResponse()
                {
                    Content = fileContent,
                    ContentType = attachment.FileType,
                    FileName = attachment.FileName,
                };
            }
            else
            {
                _logger.LogError("Failed to download attachment from IPFS: {status} {response} {url}", response.StatusCode, response.Content.ToString(), IPFSBaseUrl);
                throw new Exception($"Failed to fetch file from IPFS. Status code: {response.StatusCode}");
            }
        }

        public List<WebData.Models.FileMode> GetAllFileModes()
        {
            return _fileRepository.GetFileModes();
        }
    }
}
