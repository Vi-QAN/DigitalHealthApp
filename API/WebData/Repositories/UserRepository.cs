using WebData.Abstractions;
using WebData.Models;

namespace WebData.Repositories
{
    public class UserRepository : IUserRepository
    {
        private readonly DigitalHealthContext _context;

        public UserRepository(DigitalHealthContext context)
        {
            _context = context;
        }

        public void SaveChanges()
        {
            _context.SaveChanges();
        }

        public void AddUser(User user)
        {
            _context.Users.Add(user);
        }

        public void UpdateUser(User user)
        {
            _context.Users.Update(user);
        }

       

        public User GetUserById(int id)
        {
            return _context.Users.FirstOrDefault(u => u.UserId == id);
        }

        public User GetUserByContract(string contract)
        {
            return _context.Users.FirstOrDefault(u => u.ContractAddress == contract);
        }

        public IQueryable<AuthorizationRecord> GetAuthorizationRecordsByAccessor(int accessorId)
        {
            return _context.AuthorizationRecords.Where(a =>  a.AccessorId == accessorId);
        }

        public IQueryable<AuthorizationRecord> GetAllAuthorizationRecords()
        {
            return _context.AuthorizationRecords;
        }

        public void AddAuthorizationRecord(AuthorizationRecord authorizationRecord)
        {
            _context.AuthorizationRecords.Add(authorizationRecord);
        }

        public void UpdateAuthorizationRecord(AuthorizationRecord authorizationRecord)
        {
            _context.AuthorizationRecords.Update(authorizationRecord);
        }

        public IQueryable<User> GetAllUsers()
        {
            return _context.Users;
        }

        /*public void AddDoctor(Doctor doctor)
        {
            _context.Doctors.Add(doctor);
        }

        public Doctor GetDoctorById(Guid id)
        {
            return _context.Doctors.FirstOrDefault(d => d.Id == id);
        }*/

        /*public void AddPatient(Patient patient)
        {
            _context.Patients.Add(patient);
        }

        public Patient GetPatientById(Guid id)
        {
            return _context.Patients.FirstOrDefault(p => p.Id == id);
        }*/
    }
}
