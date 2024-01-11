using HealthSharer.Models;
using System.IO;
using System.Reflection.Emit;
using System.Security.Cryptography;

namespace HealthSharer.Services
{
    public static class CryptographicService
    {
        public static RandomSeed GenerateRandom()
        { 
            return new RandomSeed() { 
                key = RandomNumberGenerator.GetBytes(32),
                iv = RandomNumberGenerator.GetBytes(16)
            };
        }

        public static async Task<byte[]> EncryptFile(IFormFile file, byte[] iv, byte[] key)
        {
            using (Aes aesAlg = Aes.Create())
            {
                aesAlg.Key = key;
                aesAlg.IV = iv;

                using (MemoryStream memoryStream = new MemoryStream())
                using (ICryptoTransform encryptor = aesAlg.CreateEncryptor())
                using (CryptoStream cryptoStream = new CryptoStream(memoryStream, encryptor, CryptoStreamMode.Write))
                {
                    try
                    {
                        await file.CopyToAsync(cryptoStream);
                    } catch (Exception ex)
                    {
                        Console.WriteLine(ex.ToString());
                    }
                    
                    cryptoStream.Close();
                    return memoryStream.ToArray();
                }
            }
        }

        public static async Task<byte[]> DecryptFile(byte[] data, byte[] iv, byte[] key)
        {
            using (Aes aesAlg = Aes.Create())
            {
                aesAlg.Key = key;
                aesAlg.IV = iv;

                //using (FileStream encryptedFileStream = new FileStream(encryptedFilePath, FileMode.Open))
                using (MemoryStream decryptedMemoryStream = new MemoryStream())
                using (ICryptoTransform decryptor = aesAlg.CreateDecryptor())
                using (CryptoStream cryptoStream = new CryptoStream(decryptedMemoryStream, decryptor, CryptoStreamMode.Write))
                {
                    try
                    {
                        await cryptoStream.WriteAsync(data, 0, data.Length);
                        await cryptoStream.FlushFinalBlockAsync();
                    } catch (Exception ex)
                    {
                        Console.WriteLine(ex.ToString());
                    }
                    
                    return decryptedMemoryStream.ToArray();
                }
            }
        }
    }
}
