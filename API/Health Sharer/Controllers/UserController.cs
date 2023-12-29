using HealthSharer.Abstractions;
using HealthSharer.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

namespace HealthSharer.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly ILogger<UserController> _logger;
        private readonly IUserService _userService;

        public UserController(
            ILogger<UserController> logger,
            IUserService userService)
        {
            _logger = logger;
            _userService = userService;
        }

        [HttpGet]
        [Route("{address}")]
        public IActionResult GetUser([FromRoute] string address)
        {
            try
            {
                return Ok(_userService.GetUser(address));
            }
            catch
            {
                return BadRequest("Fail to get");
            }
        }

        [HttpPost]
        public IActionResult AddUser(AddUserRequest request) 
        {
            try
            {
                return Ok(_userService.AddUser(request));
            }
            catch
            {
                return BadRequest("Fail to add");
            }
            
        }

        [HttpPost]
        [Route("authorization")]
        public IActionResult AddAuthorization(AuthorizationRequest request)
        {
            try
            {
                return Ok(_userService.AddAuthorization(request));
            }
            catch
            {
                return BadRequest("Fail to add");
            }
        }

        [HttpPut]
        [Route("authorization")]
        public IActionResult RemoveAuthorization(AuthorizationRequest request)
        {
            try
            {
                return Ok(_userService.RemoveAuthorization(request));
            }
            catch
            {
                return BadRequest("Fail to add");
            }
        }

        [HttpGet]
        [Route("{userId}/authorization")]
        public IActionResult GetAuthorization([FromRoute] int userId) {
            try
            {
                return Ok(_userService.GetAuthorization(userId));
            }
            catch
            {
                return BadRequest("Fail to add");
            }
        }

    }
}
