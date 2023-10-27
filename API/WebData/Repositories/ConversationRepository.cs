
using WebData.Abstractions;
using WebData.Models;

namespace WebData.Repositories
{
    public class ConversationRepository : IConversationRepository
    {
        private readonly DigitalHealthContext _context;

        public ConversationRepository(DigitalHealthContext context)
        {
            _context = context;
        }

        public void AddConversation(Conversation conversation)
        {
            _context.Add(conversation);
        }

        public void DeleteConversation(Conversation conversation)
        {
            throw new NotImplementedException();
        }

        public Conversation GetConversationById(Guid id)
        {
            return _context.Conversations.FirstOrDefault(c => c.Id == id);
        }

        public IQueryable<Conversation> GetConversations()
        {
            return _context.Conversations;
        }

        public void AddMessage(Message message)
        {
            _context.Messages.Add(message);
        }

        public IQueryable<Message> GetMessages()
        {
            return _context.Messages;
        }

        public void SaveChanges()
        {
            _context.SaveChanges();
        }

        
    }
}
