using HealthSharer.Abstractions;
using HealthSharer.Exceptions;
using HealthSharer.Models;
using HealthSharer.Services;
using Microsoft.EntityFrameworkCore;
using NUnit.Framework.Legacy;
using WebData;
using WebData.Models;
using WebData.Repositories;

namespace Test.Services
{
    public class UserServiceTest
    {
        private IUserService _userService;
        private DigitalHealthContext _context;
        private List<User> users;
        private List<AuthorizationRecord> authorizationRecords;

        [OneTimeSetUp]
        public void Setup()
        {
            var dbOption = new DbContextOptionsBuilder<DigitalHealthContext>()
                .UseInMemoryDatabase("user Test")
                
                .Options;

            _context = new DigitalHealthContext(dbOption);

            if (!_context.FileInformation.Any())
            {
                Seed.Init(_context);
            }

            _userService = new UserService(
                new UserRepository(_context),
                MockServices.GetMockContractService());

            users = Seed.GetUsers();
            authorizationRecords = Seed.GetAuthorizationRecords(users);
        }

        [OneTimeTearDown]
        public void TearDown()
        {
            _context.Dispose();
        }

        [Test]
        public void GetUsers_Success()
        {
            // Act
            var users = _userService.GetUsers();

            // Assert
            Assert.That(users.Count(), Is.GreaterThan(0));
            var user = users.FirstOrDefault(u => u.UserId == 1);
            Assert.That(user, Is.Not.Null);
            Assert.That(user.Name, Is.EqualTo(users.First().Name));
        }

        [Test]
        public void GetUserByAddress_Success()
        {
            // Setup
            var user = users.ElementAt(0);

            // Act
            var response = _userService.GetUser(user.PublicKey);

            // Assert
            Assert.That(user.Name, Is.EqualTo(response.Name));
        }

        [Test]
        public void GetUserByAddress_NotFound()
        {
            // Assert
            Assert.Throws<NotFoundException>(() => _userService.GetUser("This is a public key"));
        }

        [Test]
        public void GetUserById_Success()
        {
            // Setup
            var user = users.ElementAt(1);

            // Act
            var response = _userService.GetUser(user.Id);

            // Assert
            Assert.That(user.Name, Is.EqualTo(response.Name));
        }

        [Test]
        public void GetUserById_NotFound()
        {
            // Assert
            Assert.Throws<NotFoundException>(() => _userService.GetUser(10));
        }

        [Test]
        public void Signup_ExistUser_Success()
        {
            // Setup
            var seedUser = Seed.GetUsers().ElementAt(0);
            var request = new SignupRequest()
            {
                Key = seedUser.PublicKey,
                UserName = seedUser.Name,
            };

            // Act
            var response = _userService.Signup(request);

            // Assert
            var users = _context.Users.Where(u => u.PublicKey == seedUser.PublicKey).ToList();
            Assert.That(users.Count, Is.EqualTo(1));
            Assert.That(users.ElementAt(0).Id, Is.EqualTo(seedUser.Id));
            Assert.That(response.UserId, Is.EqualTo(seedUser.Id));
        }

        [Test]
        public void Signup_NotExistUser_Success()
        {
            // Setup
            var request = new SignupRequest()
            {
                Key = "Key of User",
                UserName = "Test",
            };

            // Act
            var response = _userService.Signup(request);

            // Assert
            var user = _context.Users.FirstOrDefault(u => u.PublicKey == request.Key);
            Assert.That(user, Is.Not.Null);
            Assert.That(user.Name, Is.EqualTo(request.UserName));
            Assert.That(response.Key, Is.EqualTo(request.Key));
            Assert.That(response.Name, Is.EqualTo(request.UserName));
        }

        
    }
}