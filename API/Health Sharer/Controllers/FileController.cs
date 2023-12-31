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
        public IActionResult UploadFile()
        {
            try
            {
                var file = Request.Form.Files[0]; // Assumes the file is the first form entry

                if (file == null || file.Length == 0)
                {
                    return BadRequest("Invalid file");
                }

                var additionalData = Request.Form["user"];

                var dataObject = JsonConvert.DeserializeObject<GetUserResponse>(additionalData);

                _fileService.uploadFile(file, dataObject);

                return Ok("File uploaded, encrypted, and decrypted successfully");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error: {ex.Message}");
            }
        }

        

       
    }
}
