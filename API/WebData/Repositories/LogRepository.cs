using WebData.Abstractions;
using WebData.Models;

namespace WebData.Repositories
{
    public class LogRepository : ILogRepository
    {
        private readonly DigitalHealthContext _context;

        public LogRepository(DigitalHealthContext context)
        {
            _context = context;
        }

        public void AddActionLog(ActionLog Log)
        {
            _context.ActionLogs.Add(Log);
        }

        public void AddActionLogs(IEnumerable<ActionLog> Logs)
        {
            _context.ActionLogs.AddRange(Logs);
        }

        public void AddNotifications(IEnumerable<Notification> Logs)
        {
            _context.Notifications.AddRange(Logs);
        }

        public ActionLog GetActionLog(int LogId)
        {
            return _context.ActionLogs.FirstOrDefault(Log => Log.Id == LogId);
        }

        public Notification GetNotificationById(int id)
        {
            return _context.Notifications.FirstOrDefault(n => n.Id == id);
        }

        public IQueryable<Notification> GetNotificationsByUserId(int userId)
        {
            return _context.Notifications.Where(noti => noti.RecipientId == userId);
        }

        public void SaveChanges()
        {
            _context.SaveChanges();
        }

        public async Task SaveChangesAsync()
        {
            await _context.SaveChangesAsync();
        }

        public void UpdateNotification(Notification notification)
        {
            _context.Notifications.Update(notification);
        }
    }
}
