using WebData.Models;

namespace WebData.Abstractions
{
    public interface IConversationRepository : IBaseRepository
    {
        IQueryable<Conversation> GetConversations();
        Conversation GetConversationById(Guid id);
        void DeleteConversation(Conversation conversation);
        void AddConversation(Conversation conversation);
        void AddMessage(Message message);
        IQueryable<Message> GetMessages();
    }
}
