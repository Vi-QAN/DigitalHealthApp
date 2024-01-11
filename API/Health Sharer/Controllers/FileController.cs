using HealthSharer.Abstractions;
using HealthSharer.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using System;
using System.IO;
using System.Security.Cryptography;

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
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error: {ex.Message}");
            }
        }

        [HttpPost("upload")]
        public async Task<IActionResult> UploadFile([FromForm] List<IFormFile> files, [FromForm] string owner, [FromForm] string accessor)
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

        

       
    }
}
