using HealthSharer.Abstractions;
using HealthSharer.Services;
using Microsoft.EntityFrameworkCore;

using System.Text;
using WebData.Repositories;
using WebData;
using WebData.Models;

namespace Test.Services
{
    public class FileServiceTest
    {
        private FileService _fileService;
        private List<User> _users;
        private List<FileInformation> _fileInformationList;
        private DigitalHealthContext _context;

        [OneTimeSetUp] 
        public void Setup()
        {
            var dbOption = new DbContextOptionsBuilder<DigitalHealthContext>()
                .UseInMemoryDatabase("Test Database")
                .Options;
            _context = new DigitalHealthContext(dbOption);

            Seed.Init(_context);

            _fileService = new FileService(
                MockServices.GetMockContractService(),
                MockServices.GetMockInformationService(),
                MockServices.GetMockUserService(),
                MockServices.GetMockLogService(),
                new FileRepository(_context)
            );

            _fileService._httpClient = MockServices.GetMockHttpClient();

            _users = Seed.GetUsers();
            _fileInformationList = Seed.GetFileInformationList(_users);
        }

        [OneTimeTearDown]
        public void TearDown()
        {
            _context.Dispose();
        }

        [Test]
        public async Task DownloadFile_Success()
        {
            // Setup
            var fileInfo = _fileInformationList[0];

            // Act
            var response = await _fileService.downloadFile(fileInfo.FileHash, Seed.userPublicKey1, Seed.userPublicKey2);

            // Assert
            Assert.That(response.FileName, Is.EqualTo(fileInfo.FileName + '.' + fileInfo.FileExtension));
            Assert.That(response.ContentType, Is.EqualTo(fileInfo.FileType));
            Assert.That(Encoding.Default.GetString(response.Content), Is.EqualTo(Seed.generatedFileContent));
        }

        [Test]
        public async Task DownloadFiles_Success()
        {
            // Setup
            var fileIds = _fileInformationList.Where(f => f.FileExtension == "dcm").Select(f => f.Id).ToList();

            // Act 
            var response = await _fileService.downloadFiles(fileIds, Seed.userPublicKey1, Seed.userPublicKey2, "dcm");

            // Assert
            Assert.That(response.FileName.Contains("archive"), Is.True);
            Assert.That(response.Content.Length, Is.GreaterThan(0));
            Assert.That(response.ContentType, Is.EqualTo("application/zip"));
        }

        [Test]
        public async Task OpenHL7Files_Success()
        {
            // Setup
            var fileIds = _fileInformationList.Where(f => f.FileExtension == "hl7").Select(f => f.Id).ToList();

            // Act 
            var response = await _fileService.openHL7Files(fileIds, Seed.userPublicKey1, Seed.userPublicKey2, "hl7");

            // Assert
            Assert.That(response.Count, Is.EqualTo(2));
        }

    }
}
