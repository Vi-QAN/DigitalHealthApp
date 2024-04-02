using WebData.Models;

namespace WebData.Abstractions
{
    public interface IAssistantRepository : IBaseRepository
    {
        void AddMessage(AssistantMessage message);
        void AddMessages(List<AssistantMessage> messages);
        IQueryable<AssistantMessage> GetMessages(int ownerId);

    }
}
