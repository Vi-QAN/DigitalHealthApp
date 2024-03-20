using System.Drawing;

namespace HealthSharer.Models
{
    public class AddFileFromTextRequest
    {
        public int OwnerId { get; set; }
    }

    public class AddPDFFileFromTextContent {
        public class BaseInformation
        {
            public int Id { get; set; }
            public string Name { get; set; }
            public string Address { get; set; }
        }

        public class ProviderInformation : BaseInformation { 
            
        }    

        public class PatientInformation : BaseInformation
        {
            public IFormFile IDImage { get; set; }
            public string? Phone { get; set; }
        }

        public ProviderInformation Provider { get; set; }
        public PatientInformation Patient { get; set; }
        public List<string> RequestedDocuments { get; set; }
    }

    public class AddPDFFileFromTextRequest : AddFileFromTextRequest
    {
        public AddPDFFileFromTextContent Content { get; set; }
    }
    
    public class AddJSONFileFromTextContent
    {
        public string DateTime { get; set; }
        public int BloodPressure { get; set; }
        public int HeartRate { get; set; }
        public int OxygenLevel { get; set; }
    }

    public class AddJSONFileFromTextRequest : AddFileFromTextRequest {
        public List<AddJSONFileFromTextContent> Content { get; set; }
    }

}
