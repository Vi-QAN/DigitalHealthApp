namespace WebData.Models
{
    public class Device : Identity
    {
        public string Address { get; set; }
        public Guid PatientId { get; set; }
        
        public virtual Patient Patient { get; set; }
        public virtual IEnumerable<SensorValue> SensorValues { get; set; }
    }

    public class SensorType : Identity
    {
        public string Name { get; set; }

        public virtual IEnumerable<SensorValue> SensorValues { get; set; }
    }

    public class SensorValue
    {
        public int Value { get; set; }
        public DateTime RecordedDate { get; set; }
        public string RecordedLocation { get; set; }
        public Guid DeviceId { get; set; }
        public Guid SensorTypeId { get; set; }

        public virtual Device Device { get; set; }
        public virtual SensorType SensorType { get; set; }
    }
}
