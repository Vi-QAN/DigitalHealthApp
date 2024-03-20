using HealthSharer.Abstractions;
using Microsoft.AspNetCore.Mvc;

namespace HealthSharer.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class NotificationsController : ControllerBase  
    {
        private readonly ILogService _logService;

        public NotificationsController(ILogService logService)
        {
            _logService = logService;
        }

        [HttpGet]
        public IActionResult GetNotificationsByUser([FromQuery] int userId) {
            try
            {
                var notifications = _logService.GetNotificationsByUserId(userId);
                return Ok(notifications);
            } catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPut]
        [Route("{notificationId}")]
        public IActionResult UpdateNotification([FromRoute] int notificationId)
        {
            try
            {
                _logService.UpdateNotification(notificationId);
                return Ok();
            } catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}
