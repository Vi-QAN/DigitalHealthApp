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

        public static void EncryptFile(IFormFile file, byte[] iv, byte[] key)
        {
            using (Aes aesAlg = Aes.Create())
            {
                aesAlg.Key = key;
                aesAlg.IV = iv;

                using (MemoryStream memoryStream = new MemoryStream())
                using (ICryptoTransform encryptor = aesAlg.CreateEncryptor())
                using (CryptoStream cryptoStream = new CryptoStream(memoryStream, encryptor, CryptoStreamMode.Write))
                {
                    file.CopyTo(cryptoStream);
                    cryptoStream.FlushFinalBlock();

                    // Save the encrypted file
                    string encryptedFilePath = "C:\\Users\\35383\\Documents\\Final Year Project\\DigitalHealth\\File Samples\\WencryptedFile.enc";
                    File.WriteAllBytes(encryptedFilePath, memoryStream.ToArray());
                }
            }
        }

        public static void DecryptFile(IFormFile file, byte[] iv, byte[] key)
        {
            using (Aes aesAlg = Aes.Create())
            {
                aesAlg.Key = key;
                aesAlg.IV = iv;

                //using (FileStream encryptedFileStream = new FileStream(encryptedFilePath, FileMode.Open))
                /*using (MemoryStream decryptedMemoryStream = new MemoryStream())
                using (ICryptoTransform decryptor = aesAlg.CreateDecryptor())
                using (CryptoStream cryptoStream = new CryptoStream(encryptedFileStream, decryptor, CryptoStreamMode.Read))
                {
                    cryptoStream.CopyTo(decryptedMemoryStream);

                    // For demonstration purposes, you might want to save the decrypted file
                    string decryptedFilePath = "C:\\Users\\35383\\Documents\\Final Year Project\\DigitalHealth\\File Samples\\WdecryptedFile.txt";
                    System.IO.File.WriteAllBytes(decryptedFilePath, decryptedMemoryStream.ToArray());
                }*/
            }
        }
    }
}
