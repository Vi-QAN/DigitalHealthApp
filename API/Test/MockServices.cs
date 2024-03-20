using HealthSharer.Abstractions;
using HealthSharer.Models;
using Moq;
using RichardSzalay.MockHttp;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Reflection.Metadata.Ecma335;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;

namespace Test
{
    public static class MockServices
    {
        private const string IPFSBaseUrl = "http://127.0.0.1:5001/api/v0";
        private const string IPFSAddUrl = IPFSBaseUrl + "/add";
        private const string IPFSGetUrl = IPFSBaseUrl + "/cat";
        private const string IPFSDeleteUrl = IPFSBaseUrl + "/files/rm";

        public static IContractService GetMockContractService()
        {
            Mock<IContractService> service = new Mock<IContractService>();

            service.Setup(s => s.SetKey(It.IsAny<string>(), It.IsAny<RandomSeed>()));
            service.Setup(s => s.GetKey(It.IsAny<string>(), It.IsAny<string>())).Returns(Task.FromResult(Seed.cryptoSeed));

            return service.Object;
        }

        public static IFileInformationService GetMockInformationService()
        {
            Mock<IFileInformationService> service = new Mock<IFileInformationService>();

            var users = Seed.GetUsers();

            service.Setup(s => s.GetInformationById(It.IsAny<int>()))
                .Returns((int fileId) => {
                        var fileInfo = Seed.GetInformationResponses(users).FirstOrDefault(r => r.FileId == fileId);
                        return fileInfo;
                    }
                );

            service.Setup(s => s.GetAllInformationByOwner(It.IsAny<int>()))
                .Returns((int userId) =>
                {
                    var informationList = Seed.GetInformationResponses(users);
                    return informationList;
                });
            
            /*service.Setup(s => s.GetFileAction(It.IsAny<int>())).Returns(Task.FromResult(Seed.)*/

            return service.Object;
        }

        public static IFileService GetMockFileService()
        {
            Mock<IFileService> service = new Mock<IFileService>();

            return service.Object;
        }

        public static ILogService GetMockLogService()
        {
            Mock<ILogService> service = new Mock<ILogService>();

            return service.Object; 
        }

        public static IUserService GetMockUserService()
        {
            Mock<IUserService> service = new Mock<IUserService>();

            service.Setup(s => s.GetUser(It.IsAny<string>()))
                .Returns((string userKey) => {
                    var user = Seed.GetUsers().FirstOrDefault(u => u.PublicKey == userKey);
                    return new GetUserResponse()
                    {
                        Key = user.PublicKey,
                        Name = user.Name,
                        UserId = user.Id,
                    };
                });

            service.Setup(s => s.GetUser(It.IsAny<int>()))
                .Returns((int userId) => {
                    var user = Seed.GetUsers().FirstOrDefault(u => u.Id == userId);
                    return new GetUserResponse()
                    {
                        Key = user.PublicKey,
                        Name = user.Name,
                        UserId = user.Id,
                    };
                });

            return service.Object;
        }

        public static IAuthorizationService GetMockAuthorizationService()
        {
            Mock<IAuthorizationService> service = new Mock<IAuthorizationService>();

            return service.Object;
        }

        public static HttpClient GetMockHttpClient()
        {
            var handler = new MockHttpMessageHandler();

            handler.When(HttpMethod.Post, IPFSAddUrl)
                .Respond(
                    HttpStatusCode.OK,
                    "application/json",
                    JsonSerializer.Serialize(new IPFSAddResponse()
                    {
                        Hash = "",
                        Name = "Name",
                        Size = int.MaxValue,
                    }));

            handler
                .When(HttpMethod.Post, IPFSGetUrl)
                .WithQueryString(new Dictionary<string, string>{
                    { "arg", Seed.fileHash }
                })
                .Respond(req => new HttpResponseMessage()
                {
                    StatusCode = HttpStatusCode.OK,
                    Content = new StringContent(Seed.generatedFileContent)
                });

            handler
                .When(HttpMethod.Post, IPFSGetUrl)
                .WithQueryString(new Dictionary<string, string>{
                    { "arg", Seed.fileHash1 }
                })
                .Respond(req => new HttpResponseMessage()
                {
                    StatusCode = HttpStatusCode.OK,
                    Content = new StringContent(Seed.dicomFileContent1)
                });

            handler
                .When(HttpMethod.Post, IPFSGetUrl)
                .WithQueryString(new Dictionary<string, string>{
                    { "arg", Seed.fileHash2 }
                })
                .Respond(req => new HttpResponseMessage()
                {
                    StatusCode = HttpStatusCode.OK,
                    Content = new StringContent(Seed.dicomFileContent2)
                });

            handler
                .When(HttpMethod.Post, IPFSGetUrl)
                .WithQueryString(new Dictionary<string, string>{
                    { "arg", Seed.fileHash3 }
                })
                .Respond(req => new HttpResponseMessage()
                {
                    StatusCode = HttpStatusCode.OK,
                    Content = new StringContent(Seed.hl7FileContent1)
                });

            handler
                .When(HttpMethod.Post, IPFSGetUrl)
                .WithQueryString(new Dictionary<string, string>{
                    { "arg", Seed.fileHash4 }
                })
                .Respond(req => new HttpResponseMessage()
                {
                    StatusCode = HttpStatusCode.OK,
                    Content = new StringContent(Seed.hl7FileContent2)
                });

            handler.When(HttpMethod.Post, $"{IPFSDeleteUrl}*")
                .Respond(req => new HttpResponseMessage()
                {
                    StatusCode = HttpStatusCode.OK,
                });

            return handler.ToHttpClient();
        }
    }
}
