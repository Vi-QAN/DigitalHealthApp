namespace WebAPI.Models
{
    public class UserResponse
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
    }

    public class GetPatientResponse : UserResponse
    {

    }

    public class GetDoctorResponse : UserResponse
    {

    }
}
