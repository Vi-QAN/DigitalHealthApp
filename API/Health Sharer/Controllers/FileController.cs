using HealthSharer.Abstractions;
using HealthSharer.Models;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;

namespace HealthSharer.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class FileController : ControllerBase
    {
        private readonly IFileService _fileService;
        
        public FileController(IFileService fileService) { 
            _fileService = fileService;
        }

        [HttpGet]
        [Route("download")]
        public async Task<IActionResult> DownloadFiles(
            [FromQuery] List<int> fileIds, 
            [FromQuery] string owner,
            [FromQuery] string accessor,
            [FromQuery] string fileExtension)
        {
            try
            {
                var file = await _fileService.downloadFiles(fileIds, owner, accessor, fileExtension);
                Response.Headers.Add("Content-Disposition", $"attachment;filename={file.FileName}");
                Response.Headers.ContentType = file.ContentType;
                return File(file.Content, file.ContentType);

            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error: {ex.Message}");
            }
        }

        [HttpGet]
        [Route("download/{fileHash}")]
        public async Task<IActionResult> DownloadFile(
            [FromRoute] string fileHash,
            [FromQuery] string owner,
            [FromQuery] string accessor)
        {
            try
            {
               var file = await _fileService.downloadFile(fileHash, owner, accessor);
                Response.Headers.Add("Content-Disposition", $"attachment;filename={file.FileName}");
                Response.Headers.ContentType = file.ContentType;
                return File(file.Content, file.ContentType);
            } catch (Exception ex)
            {
                return StatusCode(500, $"Error: {ex.Message}");
            }
            
        }

        [HttpGet]
        [Route("open")]
        public async Task<IActionResult> OpenFiles(
            [FromQuery] List<int> fileIds,
            [FromQuery] string owner,
            [FromQuery] string accessor,
            [FromQuery] string fileExtension)
        {
            if (fileExtension == "hl7")
            {
                try
                {
                    var files = await _fileService.openHL7Files(fileIds, owner, accessor, fileExtension);
                    return Ok(files);
                } catch (Exception ex)
                {
                    return StatusCode(500, $"Error: {ex.Message}");
                }
            }

            return BadRequest("File Extension Not Supported");
        }

        [HttpPost("upload")]
        public async Task<IActionResult> UploadFiles([FromForm] List<IFormFile> files, [FromForm] string owner, [FromForm] string accessor)
        {
            try
            {
                if (files == null || files.Count == 0)
                {
                    return BadRequest("Invalid file");
                }

                var ownerInfo = JsonConvert.DeserializeObject<GetUserResponse>(owner);

                if (ownerInfo == null)
                {
                    return BadRequest("Missing owner information");
                }

                var accessorInfo = JsonConvert.DeserializeObject<GetUserResponse>(accessor);

                if (accessorInfo == null)
                {
                    return BadRequest("Missing owner information");
                }

                await _fileService.uploadFiles(files, ownerInfo, accessorInfo);

                return Ok("File uploaded, encrypted, and decrypted successfully");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error: {ex.Message}");
            }
        }

        [HttpPost]
        [Route("upload/medicalrequest")]
        public async Task<IActionResult> UploadToPDFFile(
            [FromForm] IFormFile file,
            [FromForm] string request)
        {
            try
            {
                if (file == null)
                {
                    return BadRequest("Invalid file");
                }

                var converted = JsonConvert.DeserializeObject<AddPDFFileFromTextRequest>(request);

                if (converted == null)
                {
                    return BadRequest("Missing request information");
                }

                converted.Content.Patient.IDImage = file;

                await _fileService.uploadFromText(converted);


                return Ok("File uploaded, encrypted, and decrypted successfully");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error: {ex.Message}");
            }
        }

        [HttpPost]
        [Route("upload/wearabledata")]
        public async Task<IActionResult> UploadToJSONFile(AddJSONFileFromTextRequest request)
        {
            try
            {
                
                await _fileService.uploadFromText(request);
                
                return Ok("File uploaded, encrypted, and decrypted successfully");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error: {ex.Message}");
            }
        }

        [HttpDelete]
        [Route("{fileId}")]
        public async Task<IActionResult> DeleteFile([FromRoute] int fileId)
        {
            try
            {
                await _fileService.deleteFile(fileId);
                return Ok("File deleted successfully");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error: {ex.Message}");
            }
        }

    }
}
