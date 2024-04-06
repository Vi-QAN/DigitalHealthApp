using HealthSharer.Abstractions;
using HealthSharer.Models;
using Microsoft.Extensions.Logging;
using Moq;
using RichardSzalay.MockHttp;
using Serilog;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Reflection.Metadata.Ecma335;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;
using WebData;
using WebData.Models;

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

        public static IFileInformationService GetMockInformationService(DigitalHealthContext context)
        {
            Mock<IFileInformationService> service = new Mock<IFileInformationService>();

            var users = Seed.GetUsers();

            service.Setup(s => s.GetInformationById(It.IsAny<int>()))
                .Returns((int fileId) => {
                    var fileInfo = Seed.GetInformationResponses(users).FirstOrDefault(r => r.FileId == fileId);
                    return fileInfo;
                });

            service.Setup(s => s.GetInformationByHash(It.IsAny<int>(), It.IsAny<string>()))
                .Returns((int userId, string hash) =>
                {
                    var fileInfo = Seed.GetInformationResponses(users).FirstOrDefault(r => r.FileHash == hash);
                    return fileInfo;
                });

            service.Setup(s => s.GetAllInformationByOwner(It.IsAny<int>()))
                .Returns((int userId) =>
                {
                    var informationList = Seed.GetInformationResponses(users);
                    return informationList;
                });

            service.Setup(s => s.GetFileAction(It.IsAny<int>()))
                .Returns((int actionId) => {
                    var action = context.FileActions.FirstOrDefault(a => a.Id == actionId);
                    return new GetFileActionResponse()
                    {
                        Id = action.Id,
                        Name = action.Name
                    };
                });

            service.Setup(s => s.AddAllInformation(It.IsAny<List<AddInformationRequest>>()))
                .Returns((List<AddInformationRequest> requests) =>
                {
                    var list = new List<FileInformation>()
                    {
                        Seed.GetFileInformationList(users).FirstOrDefault(i => i.Id == 6)
                    };
                  
                    return list;
                });
            
            service.Setup(s => s.GetAllInformation())
                .Returns(() => {
                    return context.FileInformation.ToList();
                });

            service.Setup(s => s.GetAllFileModes())
                .Returns(() =>
                {
                    return context.FileModes.ToList();
                });

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

            service.Setup(s => s.AddActionLogs(It.IsAny<int>(), It.IsAny<int>(), It.IsAny<IEnumerable<int>>()));

            return service.Object; 
        }

        public static IUserService GetMockUserService(DigitalHealthContext context)
        {
            Mock<IUserService> service = new Mock<IUserService>();

            service.Setup(s => s.GetUser(It.IsAny<string>()))
                .Returns((string userKey) => {
                    var user = context.Users.FirstOrDefault(u => u.PublicKey == userKey);
                    return new GetUserResponse()
                    {
                        Key = user.PublicKey,
                        Name = user.Name,
                        UserId = user.Id,
                    };
                });

            service.Setup(s => s.GetUser(It.IsAny<int>()))
                .Returns((int userId) => {
                    var user = context.Users.FirstOrDefault(u => u.Id == userId);
                    return new GetUserResponse()
                    {
                        Key = user.PublicKey,
                        Name = user.Name,
                        UserId = user.Id,
                    };
                });

            return service.Object;
        }

        public static IAuthorizationService GetMockAuthorizationService(DigitalHealthContext context)
        {
            Mock<IAuthorizationService> service = new Mock<IAuthorizationService>();

            service.Setup(s => s.GetAuthorizationRecordsByAccessor(It.IsAny<int>()))
                .Returns((int userId) =>
                { 
                    var authorizationRecords = context.AuthorizationRecords.Where(r => r.AccessorId == userId).ToList();
                    var users = context.Users.ToList();

                    return authorizationRecords.Join(
                        users,
                        record => record.OwnerId,
                        user => user.Id,
                        (record, user) => new GetAllInformationResponse()
                        {
                            OwnerId = record.OwnerId,
                            Key = user.PublicKey,
                            UserName = user.Name,
                        }).ToList();
                });

            service.Setup(s => s.GetAllAuthorizationRecords())
                .Returns(() =>
                {
                    return context.AuthorizationRecords.ToList();
                });

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
                        Hash = "This is a new IPFS hash",
                        Name = "This is a file name",
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

            handler
                .When(HttpMethod.Post, IPFSGetUrl)
                .WithQueryString(new Dictionary<string, string>{
                    { "arg", Seed.jsonHash1 }
                })
                .Respond(req => new HttpResponseMessage()
                {
                    StatusCode = HttpStatusCode.OK,
                    Content = new StringContent(Seed.jsonFileContent)
                });

            handler
                .When(HttpMethod.Post, IPFSGetUrl)
                .WithQueryString(new Dictionary<string, string>{
                    { "arg", Seed.jsonHash2 }
                })
                .Respond(req => new HttpResponseMessage()
                {
                    StatusCode = HttpStatusCode.OK,
                    Content = new StringContent(Seed.jsonFileContent)
                });

            handler
                .When(HttpMethod.Post, IPFSGetUrl)
                .WithQueryString(new Dictionary<string, string>{
                    { "arg", Seed.attachmentIPFSHash1 }
                })
                .Respond(req => new HttpResponseMessage()
                {
                    StatusCode = HttpStatusCode.OK,
                    Content = new StringContent(Seed.attachmentFileContent)
                });

            handler
                .When(HttpMethod.Post, IPFSGetUrl)
                .WithQueryString(new Dictionary<string, string>{
                    { "arg", Seed.attachmentIPFSHash2 }
                })
                .Respond(req => new HttpResponseMessage()
                {
                    StatusCode = HttpStatusCode.InternalServerError,
                });

            handler.When(HttpMethod.Post, $"{IPFSDeleteUrl}*")
                .Respond(req => new HttpResponseMessage()
                {
                    StatusCode = HttpStatusCode.OK,
                });

            return handler.ToHttpClient();
        }

        public static ILogger<T> GetMockLogger<T>()
        {
            var logger = new Mock<ILogger<T>>();

            return logger.Object;
        }

        public static IAssistantService GetMockAssistantServer()
        {
            var service = new Mock<IAssistantService>();

            service.Setup(s => s.Prompt(It.IsAny<string>()))
                .Returns((string value) => Task.FromResult(value));

            return service.Object;
        }
    }
}
