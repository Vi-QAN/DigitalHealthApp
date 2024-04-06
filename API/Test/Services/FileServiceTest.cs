using HealthSharer.Abstractions;
using HealthSharer.Services;
using Microsoft.EntityFrameworkCore;

using System.Text;
using WebData.Repositories;
using WebData;
using WebData.Models;
using Microsoft.AspNetCore.Http;
using HealthSharer.Models;
using static HealthSharer.Models.AddPDFFileFromTextContent;
using HealthSharer.Exceptions;
using System.IO;
using System.Reflection.PortableExecutable;

namespace Test.Services
{
    public class FileServiceTest
    {
        private FileService _fileService;
        private DigitalHealthContext _context;

        [OneTimeSetUp] 
        public void Setup()
        {
            var dbOption = new DbContextOptionsBuilder<DigitalHealthContext>()
                .UseInMemoryDatabase("File Test")
                .Options;
            _context = new DigitalHealthContext(dbOption);

            if (!_context.FileInformation.Any())
            {
                Seed.Init(_context);
            }

            _fileService = new FileService(
                MockServices.GetMockContractService(),
                MockServices.GetMockInformationService(_context),
                MockServices.GetMockUserService(_context),
                MockServices.GetMockLogService(),
                new FileRepository(_context),
                MockServices.GetMockLogger<FileService>(),
                MockServices.GetMockAssistantServer()
            );

            _fileService._httpClient = MockServices.GetMockHttpClient();
        }

        [OneTimeTearDown]
        public void TearDown()
        {
            _context.Dispose();
        }

        #region
        [Test]
        public async Task DownloadFile_Success()
        {
            // Setup
            var fileInfo = _context.FileInformation.ToList().ElementAt(0);

            // Act
            var response = await _fileService.downloadFile(fileInfo.FileHash, Seed.userPublicKey1, Seed.userPublicKey2);

            // Assert
            Assert.That(response.FileName, Is.EqualTo(fileInfo.FileName + '.' + fileInfo.FileExtension));
            Assert.That(response.ContentType, Is.EqualTo(fileInfo.FileType));
/*            Assert.That(Encoding.Default.GetString(response.Content), Is.EqualTo(Seed.generatedFileContent));
*/        }

        [Test]
        public async Task DownloadFiles_Success()
        {
            // Setup
            var fileIds = _context.FileInformation.Where(f => f.FileExtension == "dcm").Select(f => f.Id).ToList();

            // Act 
            var response = await _fileService.downloadFiles(fileIds, Seed.userPublicKey1, Seed.userPublicKey2, "dcm");

            // Assert
            Assert.That(response.FileName.Contains("archive"), Is.True);
            Assert.That(response.Content.Length, Is.GreaterThan(0));
            Assert.That(response.ContentType, Is.EqualTo("application/zip"));
        }
        #endregion
        [Test]
        public async Task UploadFiles_Success()
        {
            // Setup
            var owner = _context.Users.FirstOrDefault(u => u.Id == 1);
            var ownerResponse = new GetUserResponse()
            {
                Key = owner.PublicKey,
                UserId = owner.Id,
                Name = owner.Name
            };
            var accessor = _context.Users.FirstOrDefault(u => u.Id == 2);
            var accessorResponse = new GetUserResponse()
            {
                Key = accessor.PublicKey,
                UserId = accessor.Id,
                Name = accessor.Name
            };
            var content = "Hello World from a Fake File";
            var fileName = "Wearable.json";
            var stream = new MemoryStream();
            var writer = new StreamWriter(stream);
            writer.Write(content);
            writer.Flush();
            stream.Position = 0;

            var files = new List<IFormFile>()
            {
                new FormFile(stream, 0, stream.Length, null, fileName)
                {
                    Headers = new HeaderDictionary(),
                    ContentType = "application/json"
                }
            };

            // Act
            var result = await _fileService.uploadFiles(files, ownerResponse, accessorResponse);

            // Assert
            var info = result[0];
            Assert.That(info.FileMode, Is.EqualTo("Private"));
            Assert.That(info.FileName + '.' + info.FileExtension, Is.EqualTo(fileName));
        }

        [Test]
        public async Task UploadFromTextToJSON_Success()
        {
            // Setup
            var owner = _context.Users.FirstOrDefault(u => u.Id == 1);
            var request = new AddJSONFileFromTextRequest()
            {
                OwnerId = owner.Id,
                Content = new List<AddJSONFileFromTextContent>()
                {
                    new AddJSONFileFromTextContent()
                    {
                        BloodPressure = 20,
                        HeartRate = 20,
                        OxygenLevel = 10,
                        DateTime = DateTime.UtcNow.ToLongDateString(),
                    },
                    new AddJSONFileFromTextContent()
                    {
                        BloodPressure = 20,
                        HeartRate = 20,
                        OxygenLevel = 10,
                        DateTime = DateTime.UtcNow.ToLongDateString(),
                    }
                }
            };

            // Act
            var result = await _fileService.uploadFromText(request);

            // Assert
            Assert.That(result, Is.Not.Null);
            Assert.That(result.FileName.StartsWith("Wearable"), Is.True);
        }

        [Test]
        public async Task UploadFileFromTextToPDF_Success()
        {
            // Setup
            var owner = _context.Users.FirstOrDefault(u => u.Id==1);
            var stream = System.IO.File.OpenRead(Path.Combine(Seed.imageDir, "image1.jpg"));
            var formFile = new FormFile(stream, 0, stream.Length, null, "image1.jpg")
            {
                Headers = new HeaderDictionary(),
                ContentType = "image/jpeg"
            };
            var request = new AddPDFFileFromTextRequest()
            {
                OwnerId = owner.Id,
                Content = new AddPDFFileFromTextContent()
                {
                    Patient = new PatientInformation()
                    {
                        Id = 1,
                        Name = "Patient 1",
                        Address = "Test Addresss",
                        IDImage = formFile,
                        Phone = "098091234"
                    },
                    Provider = new ProviderInformation()
                    {
                        Id = 2,
                        Name = "Provider 2",
                        Address = "Provider test address"
                    },
                    RequestedDocuments = new List<string>()
                    {
                        "Tested documents"
                    }
                },
            };

            // Act
            var result = await _fileService.uploadFromText(request);

            // Assert
            Assert.That(result, Is.Not.Null);
        }

        [Test]
        public async Task DeleteFile_Success()
        {
            // Act
            await _fileService.deleteFile(6);

            // Assert
            var fileInfo = _context.FileInformation.FirstOrDefault(f => f.Id == 6);
            Assert.That(fileInfo, Is.Null);
        }

        [Test]
        public async Task DeleteFile_NotFound()
        {
            // Assert
            Assert.ThrowsAsync<NotFoundException>(async() => await _fileService.deleteFile(10));
        }

        [Test]
        public async Task OpenHL7Files_Success()
        {
            // Setup
            var fileIds = _context.FileInformation.Where(f => f.FileExtension == "hl7").Select(f => f.Id).ToList();

            // Act 
            var response = await _fileService.openHL7Files(fileIds, Seed.userPublicKey1, Seed.userPublicKey2, "hl7");

            // Assert
            Assert.That(response.Count, Is.EqualTo(2));
        }

        [Test]
        public async Task OpenWearableFiles_Success()
        {
            // Setup
            var fileIds = _context.FileInformation.Where(f => f.FileExtension == "json").Select(f => f.Id).ToList();

            // Act
            var response = await _fileService.openWearableDataFiles(fileIds, Seed.userPublicKey1, Seed.userPublicKey2, "json");

            // Assert
            Assert.That(response.ElementAt(0).ElementAt(0).DateTime, Is.Not.Null);
        }

        [Test]
        public async Task SummarizeFiles_Success()
        {
            // Setup
            var fileIds = _context.FileInformation.Where(f => f.FileExtension == "json" || f.FileExtension == "hl7").Select(f => f.Id).ToList();

            // Act 
            var response = await _fileService.summarizeFiles(fileIds, Seed.userPublicKey1, Seed.userPublicKey1);

            // Assert
            Assert.That(response, Is.Not.Null);

        }

        [Test]
        public async Task SummarizeFiles_All_Success()
        {
            // Act 
            var response = await _fileService.summarizeFiles(null, Seed.userPublicKey1, Seed.userPublicKey1);

            // Assert
            Assert.That(response, Is.Not.Null);
        }

        [Test]
        public void GetFilesSummaries_Success()
        {
            // Act
            var response = _fileService.getFilesSummaries(1);

            // Assert
            Assert.That(response, Is.Not.Null);
        }
    }
}
