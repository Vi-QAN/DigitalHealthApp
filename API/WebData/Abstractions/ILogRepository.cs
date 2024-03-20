using WebData.Models;

namespace WebData.Abstractions
{
    public interface ILogRepository : IBaseRepository
    {
        void AddActionLog(ActionLog Log);
        void AddActionLogs(IEnumerable<ActionLog> Logs);
        ActionLog GetActionLog(int LogId);

        void AddNotifications(IEnumerable<Notification> notifications);
        IQueryable<Notification> GetNotificationsByUserId(int userId);
        void UpdateNotification(Notification notification);
        Notification GetNotificationById(int id);
    }
}
