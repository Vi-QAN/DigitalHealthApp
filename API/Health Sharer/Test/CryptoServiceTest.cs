using HealthSharer.Services;
using NUnit.Framework;
using NUnit.Framework.Legacy;

namespace HealthSharer.Test
{
    public class CryptoServiceTest
    {
        private CryptographicService _service;
        [OneTimeSetUp] 
        public void SetUp() {
            _service = new Services.CryptographicService();
        }

        [Test]
        public void GetAsymmetricKeySuccess()
        {
            string key = _service.GetAsymmetricKey();

            StringAssert.Contains( "key", key);
        }

       
    }
}
