using HealthSharer.Abstractions;
using HealthSharer.Exceptions;
using HealthSharer.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using WebData.Abstractions;
using WebData.Models;
using IAuthorizationService = HealthSharer.Abstractions.IAuthorizationService;

namespace HealthSharer.Services
{
    public class LogService : ILogService
    {
        private readonly IFileInformationService _informationService;
        private readonly ILogRepository _logRepository;
        private readonly IAuthorizationService _authorizationService;

        public LogService(
            IFileInformationService informationService, 
            ILogRepository logRepository, 
            IAuthorizationService authorizationService)
        {
            _informationService = informationService;
            _logRepository = logRepository;
            _authorizationService = authorizationService;
        }

        public void AddActionLogs(int fileActionId, int userId, IEnumerable<int> informationIds)
        { 
            var fileAction = _informationService.GetFileAction(fileActionId);
            
            var logs = informationIds.Select(infoId => new ActionLog()
            {
                FileActionId = fileAction.Id,
                UserId = userId,
                InformationId = infoId,
                AddedDate = DateTime.UtcNow,
            }).ToList();

            _logRepository.AddActionLogs(logs);
            _logRepository.SaveChanges();

            AddNotifications(logs);
        }

        public void AddNotifications(IEnumerable<ActionLog> logs)
        {
            var authorizationRecords = _authorizationService.GetAllAuthorizationRecords();

            var fileInfoList = _informationService.GetAllInformation();

            var notifications = new List<Notification>();
            
            foreach (var log in logs)
            {
                var fileInfo = fileInfoList.FirstOrDefault(f => f.Id == log.InformationId);

                if (fileInfo == default || fileInfo.FileMode.Name == "Public") continue;

                var recipientIds = authorizationRecords.Where(r => r.OwnerId == fileInfo.OwnerId).Select(r => r.AccessorId).ToList();

                if (fileInfo.OwnerId != log.UserId)
                   recipientIds.Add(fileInfo.OwnerId);
                

                foreach (var recipientId in recipientIds)
                {
                    var newNoti = new Notification()
                    {
                        LogId = log.Id,
                        RecipientId = recipientId,
                        IsRead = false,
                        CreatedDate = DateTime.UtcNow,
                    };

                    notifications.Add(newNoti);
                }
            }
            
            _logRepository.AddNotifications(notifications);
            _logRepository.SaveChanges();
        }

        public void GetActionNotification()
        {
            throw new NotImplementedException();
        }

        public List<GetNotificationResponse> GetNotificationsByUserId(int userId)
        {
            var notifications = _logRepository
                .GetNotificationsByUserId(userId)
                .Include(x => x.ActionLog)
                    .ThenInclude(x => x.User)
                .Include(x => x.ActionLog)
                    .ThenInclude(x => x.FileInformation)
                .Include(x => x.ActionLog)
                    .ThenInclude(x => x.FileAction)
                .Select(n => new GetNotificationResponse()
                {
                    Id = n.Id,
                    CreatedDate = n.CreatedDate,
                    AccessorName = n.ActionLog.User.Name,
                    FileName = n.ActionLog.FileInformation.FileName,
                    FileExtension = n.ActionLog.FileInformation.FileExtension,
                    IsRead = n.IsRead,
                    ActionName = n.ActionLog.FileAction.Name
                })
                .OrderBy(n => n.CreatedDate)
                .ToList();
            return notifications;

        }

        public void UpdateNotification(int notiId)
        {
            var notification = _logRepository.GetNotificationById(notiId);

            if (notification == null)
            {
                throw new NotFoundException("Notification not found");
            }

            notification.IsRead = true;

            _logRepository.UpdateNotification(notification);
            _logRepository.SaveChanges();
        }
    }
}
