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

        public User GetUserByAddress(string address)
        {
            return _context.Users.FirstOrDefault(u => u.PublicKey == address);
        }
       
        public User GetUserById(int id)
        {
            return _context.Users.FirstOrDefault(u => u.Id == id);
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

        public async Task SaveChangesAsync()
        {
            await _context.SaveChangesAsync();
        }

        public IQueryable<FileAuthorizationRecord> GetFileAuthorizationRecordsByAccessor(int userId)
        {
            return _context.FileAuthorizationRecords.Where(r => r.AccessorId == userId);
        }

        public IQueryable<FileAuthorizationRecord> GetFileAuthorizationRecordsByOwner(int userId)
        {
            return _context.FileAuthorizationRecords.Where(r => r.OwnerId == userId);
        }

        public IQueryable<FileAuthorizationRecord> GetFileAuthorizationRecordsByFile(int fileId)
        {
            return _context.FileAuthorizationRecords.Where(r => r.FileInformationId == fileId);
        }

        public FileAuthorizationRecord GetFileAuthorizationRecord(int recordId)
        {
            return _context.FileAuthorizationRecords.FirstOrDefault(r => r.Id == recordId);
        }

        public void AddFileAuthorizationRecord(FileAuthorizationRecord fileAuthorizationRecord)
        {
            _context.FileAuthorizationRecords.Add(fileAuthorizationRecord);
        }

        public void UpdateFileAuthorizationRecord(FileAuthorizationRecord fileAuthorizationRecord)
        {
            _context.FileAuthorizationRecords.Update(fileAuthorizationRecord);
        }

        public void UpdateFileAuthorizationRecords(List<FileAuthorizationRecord> fileAuthorizationRecords)
        {
            _context.FileAuthorizationRecords.UpdateRange(fileAuthorizationRecords);
        }

        public FileAuthorizationRecord GetFileAuthorizationRecord(int ownerId, int accessorId, int fileId)
        {
            return _context.FileAuthorizationRecords.FirstOrDefault(r => 
                r.AccessorId ==  accessorId &&
                r.OwnerId == ownerId &&
                r.FileInformationId == fileId);
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
