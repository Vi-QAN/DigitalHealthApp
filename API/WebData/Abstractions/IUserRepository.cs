using WebData.Models;

namespace WebData.Abstractions
{
    public interface IUserRepository : IBaseRepository
    {
        void AddUser(User user);
        User GetUserById(int id);
        User GetUserByAddress(string address);
        IQueryable<User> GetAllUsers();
        void UpdateUser(User user);
        
        IQueryable<AuthorizationRecord> GetAuthorizationRecordsByAccessor(int accessorId);
        IQueryable<AuthorizationRecord> GetAllAuthorizationRecords();
        void AddAuthorizationRecord(AuthorizationRecord authorizationRecord);
        void UpdateAuthorizationRecord(AuthorizationRecord authorizationRecord);

        IQueryable<FileAuthorizationRecord> GetFileAuthorizationRecordsByAccessor(int userId);
        IQueryable<FileAuthorizationRecord> GetFileAuthorizationRecordsByOwner(int userId);
        IQueryable<FileAuthorizationRecord> GetFileAuthorizationRecordsByFile(int fileId);
        FileAuthorizationRecord GetFileAuthorizationRecord(int recordId);
        FileAuthorizationRecord GetFileAuthorizationRecord(int ownerId, int accessorId, int fileId);
        void AddFileAuthorizationRecord(FileAuthorizationRecord fileAuthorizationRecord);
        void UpdateFileAuthorizationRecord(FileAuthorizationRecord fileAuthorizationRecord);
        void UpdateFileAuthorizationRecords(List<FileAuthorizationRecord> fileAuthorizationRecords);
        /*void AddDoctor(Doctor doctor);
        Doctor GetDoctorById(Guid id);
        void AddPatient(Patient patient);
        Patient GetPatientById(Guid id);*/
    }
}
