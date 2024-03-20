using HealthSharer.Abstractions;
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
                .UseInMemoryDatabase("Test Database")
                
                .Options;

            _context = new DigitalHealthContext(dbOption);


            Seed.Init(_context);
            
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
        public void GetUserById_Success()
        {
            // Setup
            var user = users.ElementAt(1);

            // Act
            var response = _userService.GetUser(2);

            // Assert
            Assert.That(user.Name, Is.EqualTo(response.Name));
        }

        [Test]
        public void Signup_Success()
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
            var user = _userService.GetUsers().FirstOrDefault(u => u.UserId == response.UserId);
            Assert.That(user, Is.Not.Null);
            Assert.That(user.Key, Is.EqualTo(request.Key));
        }
    }
}