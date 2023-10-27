using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using WebAPI.Abstractions;

namespace WebAPI.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly ILogger<ConversationController> _logger;
        private readonly IUserService _userService;

        public UserController(
            ILogger<ConversationController> logger,
            IUserService userService)
        {
            _logger = logger;
            _userService = userService;
        }

        [HttpPost]
        public void AddUser(Guid projectId) 
        {

        }

        [HttpPut]
        public void UpdateUser(Guid projectId)
        {

        }

        [HttpDelete]
        public void DeleteUser(Guid projectId)
        {

        }
    }
}
