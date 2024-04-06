using HealthSharer.Models;
using HealthSharer.Services;
using Newtonsoft.Json.Serialization;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Runtime.CompilerServices;
using System.Text;
using System.Threading.Tasks;
using WebData;
using WebData.Models;
using File = System.IO.File;
using FileMode = WebData.Models.FileMode;

namespace Test
{
    public static class Seed
    {
        public const string userPublicKey1 = "0xFB92D4c2783A948C9f745592e5634448F15F3b01";
        public const string userPublicKey2 = "0xe543BCF6818Dd7a5AE26a1722150F70f543b31F2";
        public const string userPublicKey3 = "0x5D1F72353c9375440533d5d08F0756D6F0234A44";

        public const string fileHash = "QmWUTRB1spEf5GRHx5Qy13XYFGghhuFmvPWWRA4EETji4C";
        public const string fileHash1 = "QmfBDDwyuQrzKWnCBPy5kdGvQGc5YiJMfUSgZrsvKpbGJ9";
        public const string fileHash2 = "QmVVjLEr5hPs8KxcW6Hgca6HGW9knYQXaTCzLHp3GsAfuu";
        public const string fileHash3 = "QmUNu5L3GNUsA1Esad3n5ysvzxUjL9N4Z7UZEZ14fyQcQY";
        public const string fileHash4 = "QmcCY4kita1e5hf2vfzmpJVLj4iSp8HFoEJPUAxDGTibob";
        public const string fileHash5 = "QmVS9b1KGNApjSMgyjeTLKpg9Vtuz5h6fUnj9iTCeLZoBN";
        
        public const string attachmentIPFSHash1 = "Attachment IPFS Hash 1";
        public const string attachmentIPFSHash2 = "Attachment IPFS Hash 2";

        public const string jsonHash1 = "json hash 1";
        public const string jsonHash2 = "json hash 2";

        private const string directory = @"C:\Users\35383\Documents\Final Year Project\DigitalHealth\File Samples";
        private static string hl7Dir = Path.Combine(directory, "HL7");
        private static string dicomDir = Path.Combine(directory, "DICOM");
        private static string generatedDir = Path.Combine(directory, "Generated");
        public static string imageDir = Path.Combine(directory, "Images");
        public static string jsonDir = Path.Combine(directory, "JSON");

        public static string generatedFileContent = File.ReadAllText(Path.Combine(generatedDir, "Advanced Security 2 - Assignment 1.pdf"));
        public static string dicomFileContent1 = File.ReadAllText(Path.Combine(dicomDir, "image-00004.dcm"));
        public static string dicomFileContent2 = File.ReadAllText(Path.Combine(dicomDir, "image-00005.dcm"));

        public static string hl7FileContent = File.ReadAllText(Path.Combine(hl7Dir, "ADT^A01.hl7"));
        public static string hl7FileContent1 = File.ReadAllText(Path.Combine(hl7Dir, "ADT^A04.hl7"));
        public static string hl7FileContent2 = File.ReadAllText(Path.Combine(hl7Dir, "ORU^R01.hl7"));
        public static string hl7FileContent3 = File.ReadAllText(Path.Combine(hl7Dir, "ORU^R01_1.hl7"));
        public static string hl7FileContent4 = File.ReadAllText(Path.Combine(hl7Dir, "ORM^O01.hl7"));
        public static string hl7FileContent5 = File.ReadAllText(Path.Combine(hl7Dir, "RDS^O13.hl7"));

        public static string attachmentFileContent = File.ReadAllText(Path.Combine(imageDir, "image1.jpg"));


        public static string jsonFileContent = File.ReadAllText(Path.Combine(jsonDir, "sample_data.json"));

        public static RandomSeed cryptoSeed = CryptographicService.GenerateRandom();

        public static List<User> GetUsers()
        {
            return new List<User>()
            {
                new User()
                {
                    Id = 1,
                    Name = "User 1",
                    HomeAddress = "Address 1, Some City",
                    Phone = "099338881",
                    PublicKey = userPublicKey1,
                },

                new User() {
                    Id = 2,
                    Name = "User 2",
                    HomeAddress = "Address 2, Other City",
                    Phone = "088338881",
                    PublicKey = userPublicKey2,
                },
                new User()
                {
                    Id = 3,
                    Name = "User 3",
                    HomeAddress = "Address 3, Other City",
                    Phone = "088338881",
                    PublicKey = userPublicKey3
                }
            };
        }

        public static List<FileAction> GetFileActions()
        {
            return new List<FileAction>()
            {
                new FileAction(){
                    Id = 1,
                    Name = "Open",
                },
                new FileAction(){ Id = 2, Name = "Upload"},
                new FileAction(){ Id = 3, Name = "Download"},
                new FileAction(){ Id = 4, Name = "Remove"}
            };
        }

        public static List<AvailableAction> GetAvailableActions()
        {
            return new List<AvailableAction>()
            {
                new AvailableAction(){ FileActionId = 1, FileModeId = 1},
                new AvailableAction(){ FileActionId = 2, FileModeId = 1},
                new AvailableAction(){ FileActionId = 3, FileModeId = 1},
                new AvailableAction(){ FileActionId = 4, FileModeId = 1},
                new AvailableAction(){ FileActionId = 1, FileModeId = 2},
                new AvailableAction(){ FileActionId = 2, FileModeId = 2},
                new AvailableAction(){ FileActionId = 4, FileModeId = 2},
            };
        }

        public static List<ActionLog> GetActionLogs() {
            return new List<ActionLog>()
            {
                new ActionLog(){
                    Id = 1,
                    FileActionId = 1,
                    UserId = 3,
                    Notifications = new List<Notification>()
                    {
                         new Notification()
                        {
                            Id = 1,
                            IsRead = false,
                            CreatedDate = DateTime.UtcNow,
                            LogId = 1,
                            RecipientId = 2,
                        },
                    }
                }
            };
        }

        public static List<FileMode> GetFileModes() {
            return new List<FileMode>()
            {
                new FileMode()
                {
                    Id = 1,
                    Name = "Public",
                },
                new FileMode()
                {
                    Id = 2,
                    Name = "Private",
                }
            };

        }

        public static List<FileInformation> GetFileInformationList(List<User> users)
        {
            return new List<FileInformation>()
            {
                new FileInformation()
                {
                    Id = 1,
                    AddedDate = DateTime.UtcNow,
                    FileHash = fileHash,
                    MultiAddress = "/ip4/",
                    OwnerId = users.ElementAt(0).Id,
                    FileName = "Test File",
                    FileExtension = "pdf",
                    FileType = "application/pdf",
                    FileModeId = GetFileModes().ElementAt(0).Id,
                    FileAuthorizationRecords = new List<FileAuthorizationRecord>()
                    {
                        new FileAuthorizationRecord() {
                            Id = 1,
                            OwnerId = users[0].Id,
                            AccessorId = users[1].Id,
                            FileInformationId = 1,
                            IsAuthorized = true,
                        },
                    }
                },
                new FileInformation()
                {
                    Id = 2,
                    AddedDate = DateTime.UtcNow,
                    FileHash = fileHash1,
                    MultiAddress = "/ip4/",
                    OwnerId = users.ElementAt(0).Id,
                    FileName = "Test File 1",
                    FileExtension = "dcm",
                    FileType = "application/octet-stream",
                    FileModeId = GetFileModes().ElementAt(1).Id,
                    FileAuthorizationRecords = new List<FileAuthorizationRecord>()
                    {
                        new FileAuthorizationRecord()
                        {
                            Id = 2,
                            FileInformationId = 2,
                            OwnerId = users.ElementAt(0).Id,
                            AccessorId = users.ElementAt(1).Id,
                            IsAuthorized = true,
                            AuthorizedDate = DateTime.UtcNow,
                        },
                    }
                },
                new FileInformation()
                {
                    Id = 3,
                    AddedDate = DateTime.UtcNow,
                    FileHash = fileHash2,
                    MultiAddress = "/ip4/",
                    OwnerId = users.ElementAt(0).Id,
                    FileName = "Test File 2",
                    FileExtension = "dcm",
                    FileType = "application/octet-stream",
                    FileModeId = GetFileModes().ElementAt(1).Id,
                    FileNotes = new List<FileNote>()
                    {
                        new FileNote()
                        {
                            Id = 1,
                            FileInformationId = 3,
                            User = users.ElementAt(1),
                            AddedDate = DateTime.UtcNow,
                            Content = "Test Content"
                        },
                    },
                    FileAuthorizationRecords = new List<FileAuthorizationRecord>()
                    {
                        new FileAuthorizationRecord()
                        {
                            Id = 3,
                            FileInformationId = 3,
                            OwnerId = users.ElementAt(0).Id,
                            AccessorId = users.ElementAt(1).Id,
                            IsAuthorized = true,
                            AuthorizedDate = DateTime.UtcNow,
                        },
                    }
                },
                new FileInformation()
                {
                    Id = 4,
                    AddedDate = DateTime.UtcNow,
                    FileHash = fileHash3,
                    MultiAddress = "/ip4/",
                    OwnerId = users.ElementAt(0).Id,
                    FileName = "Test File 3",
                    FileExtension = "hl7",
                    FileType = "application/octet-stream",
                    FileModeId = GetFileModes().ElementAt(1).Id,
                    FileAuthorizationRecords = new List<FileAuthorizationRecord>()
                    {
                        new FileAuthorizationRecord()
                        {
                            Id = 4,
                            FileInformationId = 4,
                            OwnerId = users.ElementAt(0).Id,
                            AccessorId = users.ElementAt(1).Id,
                            IsAuthorized = false,
                            AuthorizedDate = DateTime.UtcNow,
                        },
                    }
                },
                new FileInformation()
                {
                    Id = 5,
                    AddedDate = DateTime.UtcNow,
                    FileHash = fileHash4,
                    MultiAddress = "/ip4/",
                    OwnerId = users.ElementAt(0).Id,
                    FileName = "Test File 4",
                    FileExtension = "hl7",
                    FileType = "application/octet-stream",
                    FileModeId = GetFileModes().ElementAt(1).Id,
                    FileNotes = new List<FileNote>()
                    {
                        new FileNote()
                        {
                            Id = 2,
                            FileInformationId = 5,
                            User = users.ElementAt(1),
                            AddedDate = DateTime.UtcNow,
                            Content = "Test Content",
                            Attachments = new List<FileNoteAttachment>()
                            {
                                new FileNoteAttachment()
                                {
                                    Id = 1,
                                    Hash = "Attachment 1 Hash",
                                    IPFSHash = attachmentIPFSHash1,
                                    FileName = "Successful attachment.png",
                                    FileType = "application/png",
                                    NoteId = 2
                                },

                                new FileNoteAttachment()
                                {
                                    Id = 2,
                                    Hash = "Attachment 2 Hash",
                                    IPFSHash = attachmentIPFSHash2,
                                    FileName = "Fail attachment.png",
                                    FileType = "application/png",
                                    NoteId = 2
                                },
                            }
                        },
                    },
                },
                new FileInformation()
                {
                    Id = 6,
                    AddedDate = DateTime.UtcNow,
                    FileHash = jsonHash1,
                    MultiAddress = "/ip4/",
                    OwnerId = users.ElementAt(0).Id,
                    FileName = "Wearable",
                    FileExtension = "json",
                    FileType = "application/octet-stream",
                    FileModeId = GetFileModes().ElementAt(1).Id,
                },
                new FileInformation()
                {
                    Id = 7,
                    AddedDate = DateTime.UtcNow,
                    FileHash = jsonHash2,
                    MultiAddress = "/ip4/",
                    OwnerId = users.ElementAt(0).Id,
                    FileName = "Wearable",
                    FileExtension = "json",
                    FileType = "application/json",
                    FileModeId = GetFileModes().ElementAt(1).Id,
                }
            };
        }

        public static List<GetInformationResponse> GetInformationResponses(List<User> users)
        {
            var fileInformationList = GetFileInformationList(users);

            return fileInformationList.Select(info =>
            {
                return new GetInformationResponse()
                {
                    AddedDate = info.AddedDate,
                    FileHash = info.FileHash,
                    FileId = info.Id,
                    MultiAddress = info.MultiAddress,
                    FileName = info.FileName,
                    FileExtension = info.FileExtension,
                    FileType = info.FileType,
                    FileMode = GetFileModes()[0].Name,
                    FileActions = GetFileActions().Select(f => new GetFileActionResponse()
                    {
                        Id = f.Id,
                        Name = f.Name
                    }).ToList()
                };
            }).ToList();
        }

        public static List<AuthorizationRecord> GetAuthorizationRecords(List<User> users)
        {
            return new List<AuthorizationRecord>()
            {
                new AuthorizationRecord()
                {
                    OwnerId = users.ElementAt(0).Id,
                    AccessorId = users.ElementAt(1).Id,
                    AuthorizedDate = DateTime.UtcNow,
                    IsAuthorized = true,
                },

                new AuthorizationRecord()
                {
                    OwnerId = users.ElementAt(1).Id,
                    AccessorId= users.ElementAt(2).Id,
                    AuthorizedDate= DateTime.UtcNow,
                    IsAuthorized = false
                }


            };
        }

        public static List<FilesSummary> GetFilesSummaries()
        {
            return new List<FilesSummary>()
            {
                new FilesSummary()
                {
                    MedicalDataSummary = "{\"Content\":\"Name on recordDOE JANE Age -19608591 Sex Male Allergies PENICILLIN, CAT DANDER Diagnoses MAL NEO LIVER, PRIMARY\"}",
                    WearableDataFileSummary = "[{\"NumberOfRecords\":47,\"BloodPressureAverage\":134,\"OxygenLevelAverage\":96,\"HeartRateAverage\":73,\"FromDate\":\"2024-03-25T22:34:52\",\"ToDate\":\"2024-03-27T20:34:52\",\"Id\":6,\"Name\":\"Wearable_Data_7_from_2024-03-25 22:34:52_to_2024-03-27 20:34:52.json\"}]",
                    MedicalFileRange = "[{\"Id\":4,\"Name\":\"ADT^A01.hl7\"}]",
                    GeneratedDate = DateTime.UtcNow,
                    OwnerId = 1
                }
            };
        }

        public static void Init(DigitalHealthContext context)
        {
            var fileModes = GetFileModes();
            var fileActions = GetFileActions();
            var users = GetUsers();
            var authorizationRecords = GetAuthorizationRecords(users);
            var availableActions = GetAvailableActions();
            var fileInformationList = GetFileInformationList(users);
            var filesSummaries = GetFilesSummaries();
            
            context.Users.AddRange(users);
            context.SaveChanges();

            context.AuthorizationRecords.AddRange(authorizationRecords);
            context.SaveChanges();

            context.FileActions.AddRange(fileActions);
            context.SaveChanges();

            context.FileModes.AddRange(fileModes);
            context.SaveChanges();

            context.AvailableActions.AddRange(availableActions);
            context.SaveChanges();

            context.FileInformation.AddRange(fileInformationList);
            context.SaveChanges();

            context.FilesSummaries.AddRange(filesSummaries);
            context.SaveChanges();
        }
    }
}
