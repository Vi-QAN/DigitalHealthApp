using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using WebAPI.Abstractions;
using WebAPI.Extensions;
using WebAPI.Models;
using WebData.Models;

namespace WebAPI.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class ConversationController : ControllerBase
    {
        private readonly ILogger<ConversationController> _logger;
        private readonly IConversationService _conversationService;

        public ConversationController(
            ILogger<ConversationController> logger,
            IConversationService conversationService)
        {
            _logger = logger;
            _conversationService = conversationService;
        }
        [HttpGet]
        [Route("{userId}")]
        public IActionResult GetConversationsAsync([FromRoute] Guid userId, int page = 1, int pageSize = 10)
        {
            try
            {
                return Ok(_conversationService.GetConversationsAsync(userId).ToPaged(page, pageSize));
            }
            catch
            {
                return BadRequest("Conversation not found");
            }
            
        }

        [HttpPost]
        public IActionResult AddConversation(AddConversationRequest request)
        {
            try
            {
                _conversationService.AddConversation(request);
                return Ok();
            }
            catch
            {
                return BadRequest("Fail to add conversation");
            }
            
            
        }

        [HttpPost]
        [Route("{conversationId}/messages")]
        public IActionResult AddMessage([FromRoute] Guid conversationId, [FromBody] AddMessageRequest request)
        {
            try
            {
                _conversationService.AddMessage(conversationId, request);
                return Ok();
            } catch
            {
                return BadRequest("Add Message Fail");
            }
        } 

        [HttpGet]
        [Route("{conversationId}/messages")]
        public IActionResult GetMessage([FromRoute] Guid conversationId, int page = 1, int pageSize = 20)
        {
            try
            {
                return Ok(_conversationService.GetMessages(conversationId).ToPaged(page, pageSize));
            }
            catch
            {
                return NotFound("Messages Not Found");
            }
        }
    }
}
