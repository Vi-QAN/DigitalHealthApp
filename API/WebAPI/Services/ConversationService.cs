using WebAPI.Abstractions;
using WebAPI.Extensions;
using WebAPI.Models;
using WebData.Models;
using WebData.Abstractions;
using WebAPI.Exceptions;
using Microsoft.EntityFrameworkCore;

namespace WebAPI.Services
{
    public class ConversationService : IConversationService
    {
        private readonly IConversationRepository _conversationRepository;

        public ConversationService(IConversationRepository conversationRepository)
        {
            _conversationRepository = conversationRepository;
        }

        public Guid AddConversation(AddConversationRequest request)
        {
            var existedConversation = _conversationRepository.GetConversations()
                .FirstOrDefault(c => c.PatientId == request.PatientId && c.DoctorId == request.DoctorId);

            if (existedConversation != default)
            {
                throw new BadRequestException("Conversation existed");
            }

            var createdDate = DateTime.UtcNow;

            var newConversation = new Conversation()
            {
                CreatedDate = createdDate,
                DoctorId = request.DoctorId,
                PatientId = request.PatientId,
                Messages = new List<Message>()
                {
                    new Message() {
                        MessageHash = request.Message,
                        SentBy = request.CreatedBy,
                        SentDate = createdDate
                    }
                }
            };

            _conversationRepository.AddConversation(newConversation);
            

            _conversationRepository.SaveChanges();

            return newConversation.Id;
        }

        public Guid AddMessage(Guid conversationId, AddMessageRequest request)
        {
            var conversation = _conversationRepository.GetConversationById(conversationId);
            if (conversation == null)
            {
                throw new NotFoundException("Conversation Not Found");
            }

            Message message = new Message()
            {
                MessageHash = request.Content,
                SentBy = request.SentBy,
                SentDate = DateTime.UtcNow,
                ConversationId = conversationId
            };

            _conversationRepository.AddMessage(message);

            _conversationRepository.SaveChanges();

            return message.Id;
        }

        public Task DeleteConversationAsync(int conversationId)
        {
            throw new NotImplementedException();
        }

        public List<ConversationResponse> GetConversationsAsync(Guid userId)
        {
            var conversations = _conversationRepository.GetConversations()
                .Include(c => c.Patient)
                .Include(c => c.Doctor)
                .Include(c => c.Messages)
                .Where(c => c.PatientId == userId || c.DoctorId == userId)
                .ToConversationResponseModel()
                .ToList(); 

            return conversations;
        }

        public List<GetMessageResponse> GetMessages(Guid conversationId)
        {
            return _conversationRepository.GetMessages()
                        .Where(m => m.ConversationId == conversationId)
                        .ToGetMessageResponseModel()
                        .ToList();
        }
    }
}
