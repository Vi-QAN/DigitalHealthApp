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

        [HttpPost("upload")]
        public IActionResult UploadFile([FromForm] List<IFormFile> files, [FromForm] string owner, [FromForm] string accessor)
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

                _fileService.uploadFiles(files, ownerInfo, accessorInfo);

                return Ok("File uploaded, encrypted, and decrypted successfully");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error: {ex.Message}");
            }
        }

        

       
    }
}
