using WebAPI.Models;
using WebData.Models;

namespace WebAPI.Extensions
{
    public static class ConversationExtension
    {
        public static IQueryable<ConversationResponse> ToConversationResponseModel(this IQueryable<Conversation> conversations)
        {
            var mapped = conversations.Select(c => new ConversationResponse()
            {
                Id = c.Id,
                DoctorName = c.Doctor.Name,
                PatientName = c.Patient.Name,
                LatestMessage = c.Messages.OrderBy(m => m.SentDate).Last().ToGetMessageResponseModel(),
            });
            return mapped;
        }

        public static IQueryable<GetMessageResponse> ToGetMessageResponseModel(this IQueryable<Message> messages)
        {
            return messages.Select(m => m.ToGetMessageResponseModel());
        }

        private static GetMessageResponse ToGetMessageResponseModel(this Message message)
        {
            return new GetMessageResponse()
            {
                Content = message.MessageHash,
                IsFile = message.IsFile,
                MessageId = message.Id,
                SentBy = message.SentBy
            };
        }
    }
}
