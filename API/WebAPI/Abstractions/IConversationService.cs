using WebAPI.Models;
using WebData.Models;

namespace WebAPI.Abstractions
{
    public interface IConversationService
    {
        List<ConversationResponse> GetConversationsAsync(Guid userId);
        Task DeleteConversationAsync(int conversationId);
        Guid AddConversation(AddConversationRequest conversation);
        Guid AddMessage(Guid conversationId, AddMessageRequest request);
        List<GetMessageResponse> GetMessages(Guid conversationId);
    }
}
