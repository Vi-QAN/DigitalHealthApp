using HealthSharer.Services;
using Microsoft.EntityFrameworkCore;
using System;
using WebData.Models;
using WebData.Repositories;
using WebData;
using HealthSharer.Exceptions;

namespace Test.Services
{
    public class LogServiceTest
    {
        private LogService _logService;
        private DigitalHealthContext _context;

        [OneTimeSetUp]
        public void Setup()
        {
            var dbOption = new DbContextOptionsBuilder<DigitalHealthContext>()
                .UseInMemoryDatabase("Log Test")
                .Options;
            _context = new DigitalHealthContext(dbOption);

            if (!_context.FileInformation.Any())
            {
                Seed.Init(_context);
            }

            _logService = new LogService(
                MockServices.GetMockInformationService(_context),
                new LogRepository(_context),
                MockServices.GetMockAuthorizationService(_context)
            );
        }

        [OneTimeTearDown]
        public void Teardown()
        {
            _context.Dispose();
        }

        [Test]
        public void AddActionLogs_Open_Success()
        {
            // Setup
            var fileInfo = _context.FileInformation.Last();
            var informationIds = new List<int>() { 
                fileInfo.Id
            };
            var accessor = _context.Users.FirstOrDefault(u => u.Id == 2);
            var action = _context.FileActions.FirstOrDefault(u => u.Name == "Open");

            // Act
            _logService.AddActionLogs(action.Id, accessor.Id, informationIds);

            // Assert
            var actionLogs = _context.ActionLogs.Include(l => l.Notifications).Where(l => l.UserId == accessor.Id).ToList();
            Assert.That(actionLogs.Count, Is.EqualTo(1));
            var notifications = actionLogs.Last().Notifications.ToList();
            Assert.That(notifications.Count, Is.EqualTo(1));
        }

        [Test]
        public void AddActionLogs_Upload_Remove_Success()
        {
            // Setup
            _context.AuthorizationRecords.Add(new AuthorizationRecord()
            {
                OwnerId = 1,
                AccessorId = 3,
                AuthorizedDate = DateTime.UtcNow,
                IsAuthorized = true
            });
            _context.SaveChanges();

            var fileInfo = _context.FileInformation.Last();
            var informationIds = new List<int>() {
                fileInfo.Id
            };
            var accessor = _context.Users.FirstOrDefault(u => u.Id == 2);
            var action = _context.FileActions.FirstOrDefault(u => u.Name == "Upload");

            // Act
            _logService.AddActionLogs(action.Id, accessor.Id, informationIds);

            // Assert
            var actionLogs = _context.ActionLogs.Include(l => l.Notifications).Where(l => l.UserId == accessor.Id).ToList();
            Assert.That(actionLogs.Count, Is.EqualTo(2));
            var notifications = actionLogs.Last().Notifications.ToList();
            Assert.That(notifications.Count, Is.EqualTo(2));
        }

        [Test]
        public void GetNotificationsByUserId_Success()
        {
            // Setup
            var user = _context.Users.FirstOrDefault(u => u.Id == 3);

            // Act
            var result = _logService.GetNotificationsByUserId(user.Id);

            // Assert
            Assert.That(result.Any(), Is.True);
            Assert.That(result.Count, Is.EqualTo(1));
        }

        [Test]
        public void UpdateNotification_Success()
        {
            // Act
            _logService.UpdateNotification(1);

            // Assert
            var notification = _context.Notifications.FirstOrDefault(u => u.Id == 1);
            Assert.That(notification.IsRead, Is.True); 
        }

        [TestCase()]
        public void UpdateNotification_NotFound()
        {
            // Assert
            Assert.Throws<NotFoundException>(() => _logService.UpdateNotification(10));
        }
    }
}
