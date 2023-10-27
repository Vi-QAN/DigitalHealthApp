using WebData.Models;

namespace WebData.Abstractions
{
    public interface IUserRepository : IBaseRepository
    {
        void AddDoctor(Doctor doctor);
        Doctor GetDoctorById(Guid id);
        void AddPatient(Patient patient);
        Patient GetPatientById(Guid id);
    }
}
