using WebData.Abstractions;
using WebData.Models;

namespace WebData.Repositories
{
    public class AssistantRepository : IAssistantRepository
    {
        private readonly DigitalHealthContext _context;

        public AssistantRepository(DigitalHealthContext context)
        {
            _context = context;
        }

        public void AddMessage(AssistantMessage message)
        {
            _context.AssistantMessages.Add(message);
        }

        public void AddMessages(List<AssistantMessage> messages)
        {
            _context.AssistantMessages.AddRange(messages);
        }

        public IQueryable<AssistantMessage> GetMessages(int ownerId)
        {
            return _context.AssistantMessages.Where(m => m.OwnerId == ownerId);
        }

        public void SaveChanges()
        {
            _context.SaveChanges();
        }

        public async Task SaveChangesAsync()
        {
            await _context.SaveChangesAsync();
        }
    }
}
