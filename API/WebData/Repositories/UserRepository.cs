using WebData.Abstractions;
using WebData.Models;

namespace WebData.Repositories
{
    public class UserRepository : IUserRepository, IBaseRepository
    {
        private readonly DigitalHealthContext _context;

        public UserRepository(DigitalHealthContext context)
        {
            _context = context;
        }

        public void AddDoctor(Doctor doctor)
        {
            _context.Doctors.Add(doctor);
        }

        public Doctor GetDoctorById(Guid id)
        {
            return _context.Doctors.FirstOrDefault(d => d.Id == id);
        }

        public void AddPatient(Patient patient)
        {
            _context.Patients.Add(patient);
        }

        public Patient GetPatientById(Guid id)
        {
            return _context.Patients.FirstOrDefault(p => p.Id == id);
        }

        public void SaveChanges()
        {
            _context.SaveChanges();
        }
    }
}
