using HealthSharer.Models;
using WebData.Models;

namespace HealthSharer.Abstractions
{
    public interface ILogService
    {
        void AddNotifications(IEnumerable<ActionLog> logIds, GetFileActionResponse fileAction);
        List<GetNotificationResponse> GetNotificationsByUserId(int userId);
        void UpdateNotification(int notiId);
        void AddActionLogs(int actionId, int userId, IEnumerable<int> informationId);
        
    }
}
