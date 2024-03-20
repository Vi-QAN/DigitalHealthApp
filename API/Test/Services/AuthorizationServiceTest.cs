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
                .UseInMemoryDatabase("Test Database")

                .Options;

            _context = new DigitalHealthContext(dbOption);


            Seed.Init(_context);

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
            Assert.That(authorizationRecords.ElementAt(0).OwnerId, Is.EqualTo(records[0].OwnerId));
            Assert.That(users.ElementAt(2).Id, Is.EqualTo(records[1].AccessorId));
        }

        [Test]
        public void AddAuthorization_Success()
        {
            // Setup
            var request = new AuthorizationRequest()
            {
                OwnerId = Seed.userPublicKey1,
                AccessorId = Seed.userPublicKey3,
            };

            // Act
            var response = _authorizationService.AddAuthorization(request);

            // Assert
            var owner = _context.Users.FirstOrDefault(u => u.PublicKey == request.OwnerId);
            var accessor = _context.Users.FirstOrDefault(u => u.PublicKey == request.AccessorId);
            var record = _authorizationService.GetAllAuthorizationRecords().FirstOrDefault(r => r.AccessorId == accessor.Id && r.OwnerId == owner.Id);
            Assert.That(record, Is.Not.Null);
            Assert.That(record.IsAuthorized, Is.True);
        }

        [Test]
        public void RemoveAuthorization_Success()
        {
            // Setup
            var request = new AuthorizationRequest()
            {
                OwnerId = Seed.userPublicKey1,
                AccessorId = Seed.userPublicKey3,
            };

            // Act
            var response = _authorizationService.RemoveAuthorization(request);

            // Assert
            var owner = _context.Users.FirstOrDefault(u => u.PublicKey == request.OwnerId);
            var accessor = _context.Users.FirstOrDefault(u => u.PublicKey == request.AccessorId);
            var record = _authorizationService.GetAllAuthorizationRecords().FirstOrDefault(r => r.AccessorId == accessor.Id && r.OwnerId == owner.Id);
            Assert.That(record, Is.Not.Null);
            Assert.That(record.IsAuthorized, Is.False);
        }

        [Test]
        public void GetAuthorization_Success()
        {
            // Setup
            var owner = _context.Users.FirstOrDefault(u => u.Id == 1);
            var accessor = _context.Users.FirstOrDefault(u => u.Id == 2);

            // Act
            var authorizationList = _authorizationService.GetAuthorization(owner.Id);

            // Assert
            var response = authorizationList.FirstOrDefault(r => r.AccessorId == accessor.Id);
            Assert.That(response, Is.Not.Null);
            Assert.That(response.IsAuthorized, Is.True);
        }

        [Test]
        public void GetAuthorizationRecordsByAccessor_Success()
        {
            // Setup

            // Act 
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
        public void AddFileAuthorization_Success()
        {
            // Setup
            var request = new FileAuthorizationRequest()
            {
                AccessorId = 2,
                OwnerId = 1,
                FileId = 5,
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
    }
}
