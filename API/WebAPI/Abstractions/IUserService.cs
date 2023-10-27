using WebAPI.Models;

namespace WebAPI.Abstractions
{
    public interface IUserService
    {
        public Guid AddDoctor(AddDoctorRequest request);
        public Guid AddPatient(AddPatientRequest request);

        public GetDoctorResponse GetDoctor(Guid doctorId);
        public GetPatientResponse GetPatient(Guid patientId);
    }
}
