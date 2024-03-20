using HealthSharer.Models;
using HealthSharer.Services;
using Microsoft.EntityFrameworkCore;
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
                .UseInMemoryDatabase("Test Database")
                .Options;
            _context = new DigitalHealthContext(dbOption);

            Seed.Init(_context);

            _fileInformationService = new FileInformationService(
                MockServices.GetMockUserService(),
                new FileRepository(_context),
                MockServices.GetMockAuthorizationService()
            );
        }

        [OneTimeTearDown]
        public void Teardown() {
            _context.Dispose();
        }

        [Test]
        public void AddInformation_Success()
        {
            // Setup
            var request = new AddInformationRequest()
            {
                FileHash = Seed.fileHash5,
                MultiAddress = "/ipv4/address",
                FileName = "Test file.json",
                FileType = "application/json",
                OwnerId = 2,
            };

            // Act
            _fileInformationService.AddInformation(request);

            // Assert
            var file = _context.FileInformation.FirstOrDefault(f => f.FileHash == request.FileHash);
            Assert.That(file, Is.Not.Null);
            Assert.That(file.FileName + '.' + file.FileExtension, Is.EqualTo(request.FileName));
            Assert.That(file.OwnerId, Is.EqualTo(request.OwnerId));
        }

        [Test]
        public void GetAllInformationByOwner_Success()
        {
            // Setup 
            var user = Seed.GetUsers().FirstOrDefault(u => u.Id == 1);

            // Act 
            var response = _fileInformationService.GetAllInformationByOwner(user.Id);

            // Assert
            var users = Seed.GetUsers();
            var fileInformationList = Seed.GetFileInformationList(users).Where(f => f.OwnerId == user.Id).ToList();
            Assert.That(response.Count, Is.EqualTo(fileInformationList.Count));
            Assert.That(fileInformationList[0].FileName, Is.EqualTo(response[0].FileName));
        }

        /*[Test] 
        public void GetFileNotes_Success()
        {
            // Setup
            var users = Seed.GetUsers();
            var file = Seed.GetFileInformationList(users).FirstOrDefault(f => f.Id == 3);

            // Act
            var response = _fileInformationService.GetFileNotes(file.Id);
            Assert.That(response.Count, Is.EqualTo(file.FileNotes.Count()));
            Assert.That(response[0].Content, Is.EqualTo(file.FileNotes.ElementAt(0).Content));
        }

        [Test]
        public void AddFileNote_Success()
        {
            // Setup
            var request = new AddFileNoteRequest()
            {
                FileId = 1,
                UserId = 2,
                Content = "This is a test content"
            };

            // Act
            var noteId = _fileInformationService.AddFileNote(request);

            // Assert
            var note = _context.FileNotes.FirstOrDefault(n => n.Id == noteId);
            Assert.That(note.Content, Is.EqualTo(request.Content));
            Assert.That(note.UserId, Is.EqualTo(request.UserId));
        }*/
    }
}
