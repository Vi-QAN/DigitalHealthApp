using Microsoft.AspNetCore.Mvc;
using HealthSharer.Abstractions;
using HealthSharer.Models;
using Microsoft.Extensions.Logging;

namespace HealthSharer.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class InformationController : ControllerBase
    {
        private readonly ILogger<UserController> _logger;
        private readonly IInformationService _informationService;

        public InformationController(ILogger<UserController> logger, IInformationService informationService) {
            _logger = logger;
            _informationService = informationService;
        }

        [HttpPost]
        public IActionResult AddInformation(AddInformationRequest request)
        {
            try
            {
                return Ok(_informationService.AddInformation(request));
            }
            catch
            {
                return BadRequest("Fail to add");
            }
        }

        [HttpGet]
        [Route("{userId}")]
        public IActionResult GetAllInformation([FromRoute] int userId) {
            try
            {
                return Ok(_informationService.GetAllInformationByOwner(userId));
            }
            catch
            {
                return BadRequest("Fail to add");
            }
        }

        [HttpGet]
        [Route("accessor/{userId}")]
        public IActionResult GetAllInformationByAccessor([FromRoute] int userId)
        {
            try
            {
                return Ok(_informationService.GetAllInformationByAccessor(userId));
            }
            catch
            {
                return BadRequest("Fail to add");
            }
        }
    }
}
