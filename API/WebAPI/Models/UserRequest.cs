namespace WebAPI.Models
{
    public class UserRequest
    {
        public string Name { get; set; }
        public string Address { get; set; }
        public string? Phone { get; set; }
    }

    public class AddPatientRequest : UserRequest
    {
        public int Age { get; set; }
        public int Sex { get; set; }
        public DateTime RegistrationDate { get; set; }
    }

    public class AddDoctorRequest : UserRequest
    {

    }
}
