using Microsoft.EntityFrameworkCore;
using NUnit.Framework.Internal;
using WebAPI.Exceptions;
using WebAPI.Models;
using WebAPI.Services;
using WebData;
using WebData.Models;
using WebData.Repositories;

namespace WebApiTest
{
    public class ConversationServiceTest
    {
        public Guid patientId, patientId1, doctorId, doctorId1;
     
        public DigitalHealthContext context;
        public ConversationService service;
        public IEnumerable<AddConversationRequest> addConversationRequests;
        public IEnumerable<AddMessageRequest> addMessageRequests;

        [OneTimeSetUp] 
        public void OneTimeSetUp()
        {
            var options = new DbContextOptionsBuilder<DigitalHealthContext>()
                .UseInMemoryDatabase(databaseName: "Digital Health")
                .Options;

            context = new DigitalHealthContext(options);
            service = new ConversationService(new ConversationRepository(context));

            List<Patient> patients = new List<Patient>()
            {
                new Patient()
                {
                    Name = "Patient 1",
                    Sex = 1,
                    Address = "Patient's address",
                    RegistrationDate = DateTime.UtcNow,
                },

                new Patient()
                {
                    Name = "Patient 2",
                    Sex = 0,
                    Address = "Patient's address",
                    RegistrationDate = DateTime.UtcNow,
                }
            };

            List<Doctor> doctors = new List<Doctor>()
            {
                new Doctor() {
                    Name = "Doctor 1",
                    Address = "Doctor's address",
                    
                },

                new Doctor()
                {
                    Name = "Doctor 2",
                    Address = "Doctor's address",
                },
            };

            context.Patients.AddRange(patients);
            context.Doctors.AddRange(doctors);
            context.SaveChanges();

            patientId = patients.First().Id;
            patientId1 = patients.Last().Id;

            doctorId = doctors.First().Id;
            doctorId1 = doctors.Last().Id;

            addConversationRequests = new List<AddConversationRequest>()
            {
                new AddConversationRequest()
                {
                    PatientId = patientId,
                    DoctorId = doctorId,
                    Message = "Patient Message",
                    CreatedBy = patientId,
                    IsFile = false,
                },
                new AddConversationRequest()
                {
                    PatientId = patientId,
                    DoctorId = doctorId1,
                    Message = "Doctor Message",
                    CreatedBy = doctorId1,
                    IsFile = false,
                }
            };

            addMessageRequests = new List<AddMessageRequest>()
            {
                new AddMessageRequest()
                {
                    SentBy = patientId,
                    Content = "Test message",
                    IsFile = false,
                }
            };
        }

        
        [Test]
        public void AddConversation_200Ok()
        {
            // 
            var conversation = addConversationRequests.First();

            // Act
            var conversationId = service.AddConversation(conversation);

            // Assert
            var addedConversation = context.Conversations.FirstOrDefault(c => c.Id == conversationId);

            Assert.That(addedConversation, !Is.EqualTo(null));
            Assert.That(addedConversation.PatientId, Is.EqualTo(conversation.PatientId));
            Assert.That(addedConversation.DoctorId, Is.EqualTo(conversation.DoctorId));
        }

        [Test]
        public void AddConversation_400BadRequest()
        {
            // 
            var conversation = addConversationRequests.First();

            // Assert
            Assert.That(() => service.AddConversation(conversation), Throws.Exception.TypeOf<BadRequestException>());
        }

        [Test]
        public void GetConversation_200Ok()
        {
            // Act
            service.AddConversation(addConversationRequests.ElementAt(1));
            
            // Assert
            Assert.That(service.GetConversationsAsync(patientId).Count, Is.EqualTo(addConversationRequests.Count(c => c.PatientId == patientId)));
            Assert.That(service.GetConversationsAsync(doctorId).Count, Is.EqualTo(addConversationRequests.Count(c => c.DoctorId == doctorId)));
        }

        [Test]
        public void GetMessages_200Ok()
        {
            // Act
            var conversations = service.GetConversationsAsync(patientId);
            var conversationId = conversations.Last().Id;
            var messages = service.GetMessages(conversationId);

            // Assert
            Assert.That(messages.Count, Is.EqualTo(1));
            Assert.That(messages.First().Content, Is.EqualTo("Doctor Message"));
        }

        [Test]
        public void AddMessage_200Ok()
        {
            // Act
            var conversations = service.GetConversationsAsync(patientId);
            var conversationId = conversations.First().Id;
            var messageId = service.AddMessage(conversationId, addMessageRequests.First());

            // Assert
            Assert.That(service.GetMessages(conversationId).Last().Content, Is.EqualTo("Test message"));
        }

        


        [OneTimeTearDown]
        public void TearDown()
        {
            context.Dispose();
        }
    }
}