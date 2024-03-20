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
        private readonly ILogger<UserController> _Logger;
        private readonly IUserService _userService;
        private readonly IAuthorizationService _authorizationService;

        public UserController(
            ILogger<UserController> Logger,
            IUserService userService,
            IAuthorizationService authorizationService)
        {
            _Logger = Logger;
            _userService = userService;
            _authorizationService = authorizationService;
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
        [Route("signup")]
        public IActionResult Signup(SignupRequest request) 
        {
            try
            {
                return Ok(_userService.Signup(request));
            }
            catch
            {
                return BadRequest("Fail to add");
            }
            
        }

        [HttpGet]
        public IActionResult GetUsers()
        {
            try
            {
                return Ok(_userService.GetUsers());
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPost]
        [Route("{userId}/authorization")]
        public IActionResult AddAuthorization(AuthorizationRequest request)
        {
            try
            {
                return Ok(_authorizationService.AddAuthorization(request));
            }
            catch
            {
                return BadRequest("Fail to add");
            }
        }

        [HttpPut]
        [Route("{userId}/authorization")]
        public IActionResult RemoveAuthorization(AuthorizationRequest request)
        {
            try
            {
                return Ok(_authorizationService.RemoveAuthorization(request));
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
                return Ok(_authorizationService.GetAuthorization(userId));
            }
            catch
            {
                return BadRequest("Fail to add");
            }
        }

    }
}
