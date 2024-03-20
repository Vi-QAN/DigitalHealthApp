using Microsoft.AspNetCore.Mvc;
using HealthSharer.Abstractions;
using HealthSharer.Models;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using HealthSharer.Services;

namespace HealthSharer.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class FileInformationController : ControllerBase
    {
        private readonly ILogger<UserController> _Logger;
        private readonly IFileInformationService _informationService;

        public FileInformationController(ILogger<UserController> Logger, IFileInformationService informationService) {
            _Logger = Logger;
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

        [HttpGet]
        [Route("{fileHash}/notes")]
        public IActionResult GetFileNotes([FromRoute] string fileHash, [FromQuery] string ownerKey) { 
            try
            {
                return Ok(_informationService.GetFileNotes(fileHash, ownerKey));
            }
            catch
            {
                return BadRequest("Fail to retrieve note");
            }
        }

        [HttpPost]
        [Route("{fileHash}/notes")]
        public async Task<IActionResult> AddFileNote([FromForm] List<IFormFile> attachments, [FromForm] List<string> attachmentHashes, [FromForm] string request, [FromRoute] string fileHash)
        {
            try
            {
                var deserialized = JsonConvert.DeserializeObject<AddFileNoteRequest>(request);

                var result = await _informationService.AddFileNote(attachments, attachmentHashes, deserialized, fileHash);

                return Ok(result);
            } catch {
                return BadRequest();
            }
        }

        [HttpGet]
        [Route("{fileHash}/notes/{noteId}/attachments/{attachmentId}")]
        public async Task<IActionResult> GetAttachment([FromRoute] string fileHash, [FromRoute] int noteId, [FromRoute] int attachmentId )
        {
            try
            {
                var file = await _informationService.GetAttachment(fileHash, noteId, attachmentId);
                Response.Headers.Add("Content-Disposition", $"attachment;filename={file.FileName}");
                Response.Headers.ContentType = file.ContentType;
                return File(file.Content, file.ContentType);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error: {ex.Message}");
            }
        }
    }
}
