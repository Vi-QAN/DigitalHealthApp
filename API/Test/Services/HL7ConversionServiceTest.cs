using HealthSharer.Services;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Test.Services
{
    public class HL7ConversionServiceTest
    {
        private HL7ConversionService service;
        [OneTimeSetUp] 
        public void SetUp() { 
            service = new HL7ConversionService();
        }
        [Test]
        public void ConvertAdmissionA05_Success()
        {
            // Setup
            var message = Seed.hl7FileContent1;

            // Act
            var response = service.ProcessHL7v24Message(message);

            // Assert
            Assert.That(response.AdmissionContent, Is.Not.Null);
            Assert.That(response.AdmissionContent.PatientName, Is.Not.Null);
        }

        [Test]
        public void ConvertOrderEntryO01_Success() { 
            // Setup
            var message = Seed.hl7FileContent4;

            // Act
            var response = service.ProcessHL7v23Message(message);

            // Assert
            Assert.That(response.OrderEntryContent, Is.Not.Null);
        }

        [Test]
        public void ConvertObservationResultR01_Success() {
            // Setup
            var message = Seed.hl7FileContent2;

            // Act
            var response = service.ProcessHL7v24Message(message);

            // Assert
            Assert.That(response.ObservationContent, Is.Not.Null);
        }

        [Test]
        public void ConvertDispenseR01_Success()
        {
            // Setup
            var message = Seed.hl7FileContent5;

            // Act
            var response = service.ProcessHL7v25Message(message);

            // Assert
            Assert.That(response.DispenseContent, Is.Not.Null);
        } 
    }
}
