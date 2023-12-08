using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.IO;
using System.Security.Cryptography;

namespace DigitalHealthService.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CryptographicController : ControllerBase
    {
        [HttpPost("upload")]
        public IActionResult UploadFile(IFormFile file)
        {
            if (file == null || file.Length == 0)
            {
                return BadRequest("Invalid file");
            }

            try
            {
                using (var rng = new RNGCryptoServiceProvider())
                {
                    // Generate a random IV
                    byte[] ivBytes = new byte[16];
                    rng.GetBytes(ivBytes);
                    string iv = Convert.ToBase64String(ivBytes);

                    // Generate a random key
                    byte[] keyBytes = new byte[32];
                    rng.GetBytes(keyBytes);
                    string key = Convert.ToBase64String(keyBytes);

                    // Encrypt the file
                    EncryptFile(file, key, iv);

                    // Decrypt the file (for demonstration purposes)
                    DecryptFile("C:\\Users\\35383\\Documents\\Final Year Project\\DigitalHealth\\File Samples\\WencryptedFile.enc", key, iv);
                }

                return Ok("File uploaded, encrypted, and decrypted successfully");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error: {ex.Message}");
            }
        }

        private void EncryptFile(IFormFile file, string key, string iv)
        {
            using (Aes aesAlg = Aes.Create())
            {
                aesAlg.Key = Convert.FromBase64String(key);
                aesAlg.IV = Convert.FromBase64String(iv);

                using (MemoryStream memoryStream = new MemoryStream())
                using (ICryptoTransform encryptor = aesAlg.CreateEncryptor())
                using (CryptoStream cryptoStream = new CryptoStream(memoryStream, encryptor, CryptoStreamMode.Write))
                {
                    file.CopyTo(cryptoStream);
                    cryptoStream.FlushFinalBlock();

                    // Save the encrypted file
                    string encryptedFilePath = "C:\\Users\\35383\\Documents\\Final Year Project\\DigitalHealth\\File Samples\\WencryptedFile.enc";
                    System.IO.File.WriteAllBytes(encryptedFilePath, memoryStream.ToArray());
                }
            }
        }

        private void DecryptFile(string encryptedFilePath, string key, string iv)
        {
            using (Aes aesAlg = Aes.Create())
            {
                aesAlg.Key = Convert.FromBase64String(key);
                aesAlg.IV = Convert.FromBase64String(iv);

                using (FileStream encryptedFileStream = new FileStream(encryptedFilePath, FileMode.Open))
                using (MemoryStream decryptedMemoryStream = new MemoryStream())
                using (ICryptoTransform decryptor = aesAlg.CreateDecryptor())
                using (CryptoStream cryptoStream = new CryptoStream(encryptedFileStream, decryptor, CryptoStreamMode.Read))
                {
                    cryptoStream.CopyTo(decryptedMemoryStream);

                    // For demonstration purposes, you might want to save the decrypted file
                    string decryptedFilePath = "C:\\Users\\35383\\Documents\\Final Year Project\\DigitalHealth\\File Samples\\WdecryptedFile.txt";
                    System.IO.File.WriteAllBytes(decryptedFilePath, decryptedMemoryStream.ToArray());
                }
            }
        }
    }
}
