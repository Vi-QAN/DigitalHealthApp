namespace HealthSharer.Models
{
    
    public class GetFileResponse
    {
        public string ContentType { get; set; }
        public string FileName { get; set; }
    }

    public class GetRegularFileResponse : GetFileResponse
    {
        public byte[]? Content { get; set; }
    }

    public class GetHL7FileResponse : GetFileResponse
    {
        public HL7AdmissionResponseContent? AdmissionContent { get; set; }
        public HL7ObservationResponseContent? ObservationContent { get; set; }
    }

    public class HL7ResponseContent
    {
        public string MessageType { get; set; }
    }

    public class HL7AdmissionResponseContent : HL7ResponseContent
    {
        public string AdmissionReason { get; set; }
        public List<string> Diagnosises { get; set; }
        public List<string> Allergies { get; set; }
    }

    public class HL7ObservationResponseContent : HL7ResponseContent
    {
        public List<string> ObservationTypes { get; set; }
        public List<string> ObservationValues { get; set; }
    } 
    
}
