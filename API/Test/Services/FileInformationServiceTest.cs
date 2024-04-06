using HealthSharer.Exceptions;
using HealthSharer.Models;
using HealthSharer.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using WebData;
using WebData.Repositories;

namespace Test.Services
{
    public class FileInformationServiceTest
    {
        private FileInformationService _fileInformationService;
        private DigitalHealthContext _context;

        [OneTimeSetUp]
        public void Setup()
        {
            var dbOption = new DbContextOptionsBuilder<DigitalHealthContext>()
                .UseInMemoryDatabase("File Information Test")
                .Options;
            _context = new DigitalHealthContext(dbOption);

            if (!_context.FileInformation.Any())
            {
                Seed.Init(_context);
            }

            _fileInformationService = new FileInformationService(
                MockServices.GetMockUserService(_context),
                new FileRepository(_context),
                MockServices.GetMockAuthorizationService(_context),
                MockServices.GetMockLogger<FileInformationService>()
            );

            _fileInformationService._httpClient = MockServices.GetMockHttpClient();
        }

        [OneTimeTearDown]
        public void Teardown() {
            _context.Dispose();
        }

        [Test]
        public void AddInformation_Success()
        {
            // Setup
            var owner = _context.Users.FirstOrDefault(u => u.Id == 2);
            var request = new AddInformationRequest()
            {
                FileHash = Seed.fileHash5,
                MultiAddress = "/ipv4/address",
                FileName = "Test file.json",
                FileType = "application/json",
                OwnerId = owner.Id,
            };

            // Act
            _fileInformationService.AddInformation(request);

            // Assert
            var file = _context.FileInformation.Include(f => f.FileMode).FirstOrDefault(f => f.FileHash == request.FileHash);
            Assert.That(file, Is.Not.Null);
            Assert.That(file.FileName + '.' + file.FileExtension, Is.EqualTo(request.FileName));
            Assert.That(file.OwnerId, Is.EqualTo(request.OwnerId));
            Assert.That(file.FileMode.Name, Is.EqualTo("Public"));
        }

        [Test]
        public void AddInformation_BadRequest()
        {
            // Setup
            var owner = _context.Users.FirstOrDefault(u => u.Id == 1);
            var request = new AddInformationRequest()
            {
                FileHash = Seed.fileHash4,
                MultiAddress = "/ipv4/address",
                FileName = "Test file.json",
                FileType = "application/json",
                OwnerId = owner.Id,
            };

            // Assert
            Assert.Throws<BadRequestException>(() => _fileInformationService.AddInformation(request));
        }

        [Test]
        public void GetAllInformationByOwner_Success()
        {
            // Setup 
            var user = _context.Users.FirstOrDefault(u => u.Id == 1);

            // Act 
            var response = _fileInformationService.GetAllInformationByOwner(user.Id);

            // Assert 
            var fileInformationList = _context.FileInformation.Where(f => f.OwnerId == user.Id).OrderBy(f => f.AddedDate).ToList();
            Assert.That(response.Count, Is.EqualTo(fileInformationList.Count));
            Assert.That(fileInformationList[0].FileName, Is.EqualTo(response[0].FileName));
        }

        [Test]
        public void GetAllInformationByAccessor_Success()
        {
            // Setup
            var accessor = _context.Users.FirstOrDefault(u => u.Id == 2);

            // Act 
            var response = _fileInformationService.GetAllInformationByAccessor(accessor.Id);

            // Assert
            var records = _context.AuthorizationRecords.Where(r => r.AccessorId == accessor.Id).ToList();
            var fileInformationList = _context.FileInformation.Where(f => f.OwnerId == 1).ToList();
            Assert.That(response.Any(), Is.True);
            Assert.That(response.Count, Is.EqualTo(records.Count));
            Assert.That(response.FirstOrDefault(r => r.OwnerId == 1).InformationList.Count, Is.EqualTo(fileInformationList.Count));
        }

        [Test]
        public void AddAllInformation_Success()
        {
            // Setup
            var owner = _context.Users.FirstOrDefault(u => u.Id == 1);
            var requests = new List<AddInformationRequest>()
            {
                new AddInformationRequest()
                {
                    FileHash = "new file hash",
                    MultiAddress = "multi address",
                    FileName = "new_file_name.pdf",
                    FileType = "application/pdf",
                    OwnerId = owner.Id,
                }
            };

            // Act
            var result = _fileInformationService.AddAllInformation(requests);

            // Assert
            var fileInfo = _context.FileInformation.Include(f => f.FileMode).FirstOrDefault(f => f.FileHash == requests.First().FileHash);
            Assert.That(fileInfo, Is.Not.Null);
            Assert.That(fileInfo.FileMode.Name, Is.EqualTo("Private"));
            Assert.That(requests.Count, Is.EqualTo(result.Count));
        }

        [Test]
        public void GetFileAction_Success()
        {
            // Setup
            var action = _context.FileActions.FirstOrDefault(a => a.Id == 1);

            // Act
            var result = _fileInformationService.GetFileAction(action.Id);

            // Assert
            Assert.That(action.Name, Is.EqualTo(result.Name));
        }

        [Test]
        public void GetInformationById_Success()
        {
            // Setup
            var fileInfo = _context.FileInformation.FirstOrDefault(f => f.Id == 1);

            // Act
            var result = _fileInformationService.GetInformationById(fileInfo.Id);

            // Assert
            Assert.That(fileInfo.FileHash, Is.EqualTo(result.FileHash));
        }

        [Test]
        public void GetInformationById_NotFound()
        { 
            // Assert
            Assert.Throws<NotFoundException>(() => _fileInformationService.GetInformationById(10));
        }

        [Test]
        public void GetInformationByHash_Success()
        {
            // Setup
            var owner = _context.Users.FirstOrDefault(u => u.Id == 1);
            var fileInfo = _context.FileInformation.FirstOrDefault(f => f.OwnerId == owner.Id && f.FileHash == Seed.fileHash);

            // Act
            var result = _fileInformationService.GetInformationByHash(owner.Id, Seed.fileHash);

            // Assert
            Assert.That(fileInfo.FileName, Is.EqualTo(result.FileName));
        }

        [Test]
        public void GetInformationByHash_NotFound()
        {
            // Assert
            Assert.Throws<NotFoundException>(() => _fileInformationService.GetInformationByHash(10, Seed.fileHash));
            Assert.Throws<NotFoundException>(() => _fileInformationService.GetInformationByHash(1, "file hash"));
        }

        [Test]
        public void GetAllInformation()
        {
            // Setup
            var orginalLength = _context.FileInformation.ToList().Count;

            // Act
            var result = _fileInformationService.GetAllInformation();

            // Assert
            Assert.That(result.Any(), Is.True);
            Assert.That(result.Count, Is.EqualTo(orginalLength));
            Assert.That(result.All(r => r.FileMode != null), Is.True);
        }

        [Test]
        public void GetFileNotes_Success()
        {
            // Setup
            var owner = _context.Users.FirstOrDefault(u => u.Id == 1);
            var fileHash = Seed.fileHash2;

            // Act
            var response = _fileInformationService.GetFileNotes(fileHash, owner.PublicKey);

            // Assert
            Assert.That(response.Count, Is.EqualTo(1));
            Assert.That(response[0].Content, Is.EqualTo("Test Content"));
        }

        [Test]
        public void GetFileNotes_FileNotFound()
        {
            // Setup
            var owner = _context.Users.FirstOrDefault(u => u.Id == 1);
            var fileHash = "Test file hash";

            // Assert
            Assert.Throws<NotFoundException>(() => _fileInformationService.GetFileNotes(fileHash, owner.PublicKey));
        }

        [Test]
        public async Task AddFileNote_Success()
        {
            // Setup
            var owner = _context.Users.FirstOrDefault(u => u.Id == 1);
            var accessor = _context.Users.FirstOrDefault(u => u.Id == 2);
            var content = "Hello World from a Fake File";
            var fileName = "test.pdf";
            var stream = new MemoryStream();
            var writer = new StreamWriter(stream);
            writer.Write(content);
            writer.Flush();
            stream.Position = 0;

            var attachments = new List<IFormFile>()
            {
                new FormFile(stream, 0, stream.Length, null, fileName)
                {
                    Headers = new HeaderDictionary(),
                    ContentType = "application/pdf"
                }
            };

            var attachmentHashes = new List<string>()
            {
                "test file hash"
            };

            var request = new AddFileNoteRequest()
            {
                OwnerKey = owner.PublicKey,
                AccessorKey = accessor.PublicKey,
                Content = "This is a test content"
            };

            var fileHash = Seed.fileHash4;

            // Act
            var result = await _fileInformationService.AddFileNote(attachments, attachmentHashes, request, fileHash);

            // Assert
            var note = _context.FileNotes.FirstOrDefault(n => n.Content == request.Content);
            Assert.That(note, Is.Not.Null);
            Assert.That(note.Attachments.Any(), Is.True);
            Assert.That(note.Attachments.ElementAt(0).Hash, Is.EqualTo(attachmentHashes.ElementAt(0)));
        }

        [Test]
        public void AddFileNote_FileNotFound()
        {
            // Setup
            var owner = _context.Users.FirstOrDefault(u => u.Id == 1);
            var accessor = _context.Users.FirstOrDefault(u => u.Id == 2);
            var content = "Hello World from a Fake File";
            var fileName = "test.pdf";
            var stream = new MemoryStream();
            var writer = new StreamWriter(stream);
            writer.Write(content);
            writer.Flush();
            stream.Position = 0;

            var attachments = new List<IFormFile>()
            {
                new FormFile(stream, 0, stream.Length, null, fileName)
                {
                    Headers = new HeaderDictionary(),
                    ContentType = "application/pdf"
                }
            };

            var attachmentHashes = new List<string>()
            {
                "test file hash"
            };

            var request = new AddFileNoteRequest()
            {
                OwnerKey = owner.PublicKey,
                AccessorKey = accessor.PublicKey,
                Content = "This is a test content"
            };

            var fileHash = "Test file hash";

            // Assert
            Assert.ThrowsAsync<NotFoundException>( async () => await _fileInformationService.AddFileNote(attachments, attachmentHashes, request, fileHash));
        }

        [Test]
        public async Task GetAttachment_Success()
        {
            // Setup
            var fileHash = Seed.fileHash4;
            var note = _context.FileNotes.Include(n => n.Attachments).FirstOrDefault(n => n.Id == 2);
            var attachments = note.Attachments;

            // Act
            var result = await _fileInformationService.GetAttachment(fileHash, note.Id, attachments.ElementAt(0).Id);

            // Assert
            Assert.That(result.Content.Length, Is.GreaterThan(0));
            Assert.That(result.FileName, Is.EqualTo(attachments.ElementAt(0).FileName));
        }

        [Test]
        public async Task GetAttachment_NotFound()
        {
            // Setup
            var fileHash = Seed.fileHash4;
            var note = _context.FileNotes.Include(n => n.Attachments).FirstOrDefault(n => n.Id == 2);
            var attachments = note.Attachments;

            // Assert
            Assert.ThrowsAsync<NotFoundException>(async () => await _fileInformationService.GetAttachment(fileHash, note.Id, 10));
        }

        [Test]
        public async Task GetAttachment_NetworkException()
        {
            // Setup
            var fileHash = Seed.fileHash4;
            var note = _context.FileNotes.Include(n => n.Attachments).FirstOrDefault(n => n.Id == 2);
            var attachments = note.Attachments;

            // Assert
            Assert.ThrowsAsync<Exception>(async () => await _fileInformationService.GetAttachment(fileHash, note.Id, attachments.ElementAt(1).Id));
        }

        [Test]
        public void GetGetAllFileModes()
        {
            // Setup
            var fileModeLength = _context.FileModes.ToList().Count;

            // Act
            var result = _fileInformationService.GetAllFileModes();
            
            // Assert
            Assert.That(fileModeLength, Is.EqualTo(result.Count));
        }
    }
}
