namespace HealthSharer.Models
{
    
    public class GetFileResponse
    {
        public int FileId { get; set; }
        public string ContentType { get; set; }
        public string FileName { get; set; }
    }

    public class GetRegularFileResponse : GetFileResponse
    {
        public byte[] Content { get; set; }
    }

    public class GetHL7FileResponse : GetFileResponse
    {
        public HL7AdmissionResponseContent AdmissionContent { get; set; } = null;
        public HL7ObservationResultResponseContent ObservationContent { get; set; } = null;
        public HL7PharmacyTreatmentDispenseResponseContent DispenseContent { get; set; } = null;
        public HL7OrderEntryResponseContent OrderEntryContent { get; set; } = null;
    }

    public class HL7ResponseContent
    {
        public string MessageType { get; set; }
        public string PatientName { get; set; }
        public string DOB { get; set; }
        public string Sex { get; set; }
    }

    public class Observation
    {
        public string Type { get; set; }
        public string Value { get; set; }
    }

    public class Transaction
    {
        public string Currency { get; set; }
        public string Date { get; set; }
        public string Price { get; set; }
        public string Code { get; set; }
    }

    public class HL7ObservationResultResponseContent : HL7ResponseContent
    {
        public List<Observation> Observations { get; set; }
    }

    public class HL7PharmacyTreatmentDispenseResponseContent : HL7ResponseContent 
    { 
        public List<Transaction> Transactions { get; set; }
    }

    public class HL7AdmissionResponseContent : HL7ResponseContent
    {
        public string AdmissionReason { get; set; }
        public List<string> Diagnosises { get; set; }
        public List<string> Allergies { get; set; }
        public List<Observation> Observations { get; set; }
    }

    public class HL7OrderEntryResponseContent : HL7ResponseContent
    {
        public List<string> Diagnosises { get; set; }
        public List<string> Allergies { get; set; }
        public List<Observation> Observations { get; set; }
    }

    public class GetFilesSummaryResponse
    {
        public int Id { get; set; }
        public DateTime GeneratedDate { get; set; }
        public MedicalDataSummary MedicalDataSummary { get; set; }
        public List<File> MedicalDataFiles { get; set; }
        public List<WearableDataFileSummary> WearableDataFilesSummaries { get; set; }
    }

    public class File
    {
        public int Id { get; set; }
        public string Name { get; set; }
    }

    public class MedicalDataSummary
    {
        public string Content { get; set; }
    }

    public class WearableDataFileSummary : File 
    {
        public int NumberOfRecords { get; set; }
        public float BloodPressureAverage { get; set; }
        public float OxygenLevelAverage { get; set; }
        public float HeartRateAverage { get; set; }
        public DateTime FromDate { get; set; }
        public DateTime ToDate { get; set; }
    }
}
