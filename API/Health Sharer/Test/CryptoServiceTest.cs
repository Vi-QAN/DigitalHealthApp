using DigitalHealthService.Services;
using NUnit.Framework;
using NUnit.Framework.Legacy;

namespace DigitalHealthService.Test
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
