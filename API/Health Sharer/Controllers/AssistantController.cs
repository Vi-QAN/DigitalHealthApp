using HealthSharer.Abstractions;
using HealthSharer.Models;
using HealthSharer.Services;
using Microsoft.AspNetCore.Mvc;

namespace HealthSharer.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AssistantController : ControllerBase
    {
        private readonly IAssistantService _assistantService;
        
        public AssistantController(IAssistantService assistantService) {
            _assistantService = assistantService;   
        }

        [HttpGet]
        [Route("messages")]
        public async Task<IActionResult> GetMessageHistory([FromQuery] int ownerId)
        {
            try
            {
                var result = _assistantService.GetMessageHistory(ownerId); 
                return Ok(result);

            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error: {ex.Message}");
            }
        }

        [HttpPost]
        [Route("messages")]
        public async Task<IActionResult> Prompt([FromBody] AssistantRequest request)
        {
            try
            {
                var result = await _assistantService.Prompt(request.OwnerId,request.UserMessage);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error: {ex.Message}");
            }
        }

        [HttpPost]
        [Route("detection")]
        public async Task<IActionResult> PromptDetection([FromBody] List<DetectionRequest> requests, [FromQuery] int ownerId)
        {
            try
            {
                var result = await _assistantService.Prompt(requests, ownerId);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error: {ex.Message}");
            }
        }
    }
}
