using HealthSharer.Abstractions;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using WebData.Models;
using WebData;
using HealthSharer.Services;
using Microsoft.EntityFrameworkCore;
using WebData.Repositories;
using HealthSharer.Models;
using HealthSharer.Exceptions;

namespace Test.Services
{
    public class AuthorizationServiceTest
    {
        private IAuthorizationService _authorizationService;
        private DigitalHealthContext _context;
        private List<User> users;
        private List<AuthorizationRecord> authorizationRecords;

        [OneTimeSetUp]
        public void Setup()
        {
            var dbOption = new DbContextOptionsBuilder<DigitalHealthContext>()
                .UseInMemoryDatabase("Authorization Test")

                .Options;

            _context = new DigitalHealthContext(dbOption);


            if (!_context.FileInformation.Any())
            {
                Seed.Init(_context);
            }

            _authorizationService = new AuthorizationService(
                new UserRepository(_context),
                MockServices.GetMockContractService()
            );

            users = Seed.GetUsers();
            authorizationRecords = Seed.GetAuthorizationRecords(users);
        }

        [OneTimeTearDown]
        public void TearDown()
        {
            _context.Dispose();
        }

        [Test]
        public void GetAllAuthorizationRecords_Success()
        {
            // Act
            var records = _authorizationService.GetAllAuthorizationRecords();

            // Assert
            Assert.That(records.Any(), Is.True);
            /*Assert.That(authorizationRecords.ElementAt(0).OwnerId, Is.EqualTo(records[0].OwnerId));
            Assert.That(users.ElementAt(2).Id, Is.EqualTo(records[1].AccessorId));*/
        }

        [Test]
        public void AddAuthorization_AddNewRecord_Success()
        {
            // Setup
            var owner = _context.Users.FirstOrDefault(u => u.PublicKey == Seed.userPublicKey1);
            var accessor = _context.Users.FirstOrDefault(u => u.PublicKey == Seed.userPublicKey3);
            var request = new AuthorizationRequest()
            {
                OwnerId = owner.PublicKey,
                AccessorId = accessor.PublicKey,
            };

            // Act
            var response = _authorizationService.AddAuthorization(request);

            // Assert
            var record = _context.AuthorizationRecords.FirstOrDefault(r => r.AccessorId == accessor.Id && r.OwnerId == owner.Id);
            Assert.That(record, Is.Not.Null);
            Assert.That(record.IsAuthorized, Is.True);
            Assert.That(response.IsAuthorized, Is.True);
            Assert.That(response.AccessorKey, Is.EqualTo(accessor.PublicKey));
        }

        [Test]
        public void AddAuthorization_UpdateRecord_Success()
        {
            // Setup
            var owner = _context.Users.FirstOrDefault(u => u.PublicKey == Seed.userPublicKey2);
            var accessor = _context.Users.FirstOrDefault(u => u.PublicKey == Seed.userPublicKey3);
            var oldLength = _context.AuthorizationRecords.ToList().Count;
            var request = new AuthorizationRequest()
            {
                OwnerId = owner.PublicKey,
                AccessorId = accessor.PublicKey,
            };

            // Act
            var response = _authorizationService.AddAuthorization(request);

            // Assert
            var record = _context.AuthorizationRecords.FirstOrDefault(r => r.AccessorId == accessor.Id && r.OwnerId == owner.Id);
            Assert.That(record, Is.Not.Null);
            Assert.That(record.IsAuthorized, Is.True);
            Assert.That(oldLength, Is.EqualTo(_context.AuthorizationRecords.ToList().Count));
            Assert.That(response.IsAuthorized, Is.True);
            Assert.That(response.AccessorKey, Is.EqualTo(accessor.PublicKey));
        }

        [Test]
        public void AddAuthorization_OwnerNotFound()
        {
            // Setup
            var request = new AuthorizationRequest()
            {
                OwnerId = "Different owner key",
                AccessorId = Seed.userPublicKey3,
            };

            // Act
            Assert.Throws<NotFoundException>(() => _authorizationService.AddAuthorization(request));
        }

        [Test]
        public void AddAuthorization_AccessorNotFound()
        {
            // Setup
            var request = new AuthorizationRequest()
            {
                OwnerId = Seed.userPublicKey1,
                AccessorId = "Different accessor key",
            };

            // Act
            Assert.Throws<NotFoundException>(() => _authorizationService.AddAuthorization(request));
        }

        [Test]
        public void RemoveAuthorization_Success()
        {
            // Setup
            var owner = _context.Users.FirstOrDefault(u => u.PublicKey == Seed.userPublicKey1);
            var accessor = _context.Users.FirstOrDefault(u => u.PublicKey == Seed.userPublicKey2);
            var request = new AuthorizationRequest()
            {
                OwnerId = owner.PublicKey,
                AccessorId = accessor.PublicKey,
            };

            // Act
            var response = _authorizationService.RemoveAuthorization(request);

            // Assert
            var record = _context.AuthorizationRecords.FirstOrDefault(r => r.AccessorId == accessor.Id && r.OwnerId == owner.Id);
            var fileRecords = _context.FileAuthorizationRecords.Where(r => r.AccessorId == accessor.Id && r.OwnerId == owner.Id).ToList();
            Assert.That(record, Is.Not.Null);
            Assert.That(record.IsAuthorized, Is.False);
            Assert.That(fileRecords.Any(), Is.True);
            Assert.That(fileRecords.All(r => r.IsAuthorized == false), Is.True);
        }

        [Test]
        public void RemoveAuthorization_OwnerNotFound()
        {
            // Setup
            var request = new AuthorizationRequest()
            {
                OwnerId = "Different owner key",
                AccessorId = Seed.userPublicKey3,
            };

            // Act
            Assert.Throws<NotFoundException>(() => _authorizationService.RemoveAuthorization(request));
        }

        [Test]
        public void RemoveAuthorization_AccessorNotFound()
        {
            // Setup
            var request = new AuthorizationRequest()
            {
                OwnerId = Seed.userPublicKey1,
                AccessorId = "Different accessor key",
            };

            // Act
            Assert.Throws<NotFoundException>(() => _authorizationService.RemoveAuthorization(request));
        }

        [Test]
        public void RemoveAuthorization_RecordNotFound()
        {
            // Setup
            var request = new AuthorizationRequest()
            {
                OwnerId = Seed.userPublicKey2,
                AccessorId = Seed.userPublicKey1,
            };

            // Act
            Assert.Throws<NotFoundException>(() => _authorizationService.RemoveAuthorization(request));
        }

        [Test]
        public void GetAuthorization_Success()
        {
            // Setup
            var owner = _context.Users.FirstOrDefault(u => u.Id == 1);

            // Act
            var authorizationList = _authorizationService.GetAuthorization(owner.Id);

            // Assert
            Assert.That(authorizationList.Any(), Is.True);
            Assert.That(authorizationList.All(r => r.IsAuthorized == true), Is.True);
        }

        [Test]
        public void GetAuthorization_UserNotFound()
        {
            // Assert
            Assert.Throws<NotFoundException>(() => _authorizationService.GetAuthorization(10));
        }

        [Test]
        public void GetAuthorizationRecordsByAccessor_Success()
        {
            // Setup
            var accessor = _context.Users.FirstOrDefault(u => u.Id == 2);

            // Act
            var result = _authorizationService.GetAuthorizationRecordsByAccessor(accessor.Id);

            // Assert
            Assert.That(result.Any(), Is.True);
            Assert.That(result.Count, Is.EqualTo(1));
        }

        [Test]
        public void GetFileAuthorizationRecords_Success()
        {
            // Setup
            var file = Seed.GetFileInformationList(users).FirstOrDefault(f => f.Id == 2);

            // Act
            var response = _authorizationService.GetFileAuthorizationRecords(file.Id);

            // Assert
            var user = users.FirstOrDefault(u => u.Id == 2);
            var accessor = response.FirstOrDefault(u => u.AccessorId == user.Id);
            Assert.That(accessor, Is.Not.Null);
            Assert.That(accessor.AccessorName, Is.EqualTo(user.Name));
        }

        [Test]
        public void RemoveFileAuthorization_Success()
        {
            // Setup
            var recordId = 3;

            // Act 
            _authorizationService.RemoveFileAuthorization(recordId);

            // Assert
            var record = _context.FileAuthorizationRecords.FirstOrDefault(r => r.Id == recordId);
            Assert.That(record, Is.Not.Null);
            Assert.That(record.IsAuthorized, Is.False);
        }

        [Test]
        public void RemoveFileAuthorization_NotFound()
        {
            // Assert
            Assert.Throws<NotFoundException>(() => _authorizationService.RemoveFileAuthorization(10));
        }

        [Test]
        public void AddFileAuthorization_AddNewRecord_Success()
        {
            // Setup
            var owner = _context.Users.FirstOrDefault(u => u.Id == 1);
            var accessor = _context.Users.FirstOrDefault(u => u.Id == 2);
            var fileInfo = _context.FileInformation.FirstOrDefault(f => f.Id == 5);
            var request = new FileAuthorizationRequest()
            {
                AccessorId = accessor.Id,
                OwnerId = owner.Id,
                FileId = fileInfo.Id,
            };

            // Act
            _authorizationService.AddFileAuthorization(request);

            // Assert
            var record = _context.FileAuthorizationRecords.
                FirstOrDefault(r => r.AccessorId == request.AccessorId
                        && r.OwnerId == request.OwnerId
                        && r.FileInformationId == request.FileId);

            Assert.That(record, Is.Not.Null);
            Assert.That(record.IsAuthorized, Is.True);
        }

        [Test]
        public void AddFileAuthorization_UpdateRecord_Success()
        {
            // Setup
            var owner = _context.Users.FirstOrDefault(u => u.Id == 1);
            var accessor = _context.Users.FirstOrDefault(u => u.Id == 2);
            var fileInfo = _context.FileInformation.FirstOrDefault(f => f.Id == 4);
            var oldLength = _context.FileAuthorizationRecords.ToList().Count;
            var request = new FileAuthorizationRequest()
            {
                AccessorId = accessor.Id,
                OwnerId = owner.Id,
                FileId = fileInfo.Id,
            };

            // Act
            _authorizationService.AddFileAuthorization(request);

            // Assert
            var record = _context.FileAuthorizationRecords.
                FirstOrDefault(r => r.AccessorId == request.AccessorId
                        && r.OwnerId == request.OwnerId
                        && r.FileInformationId == request.FileId);

            Assert.That(record, Is.Not.Null);
            Assert.That(record.IsAuthorized, Is.True);
            Assert.That(oldLength, Is.EqualTo(_context.FileAuthorizationRecords.ToList().Count));
        }
    }
}
