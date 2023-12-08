using WebData.Models;

namespace WebData.Abstractions
{
    public interface IUserRepository : IBaseRepository
    {
        void AddUser(User user);
        User GetUserById(int id);
        User GetUserByContract(string contract);
        IQueryable<User> GetAllUsers();
        void UpdateUser(User user);
        IQueryable<AuthorizationRecord> GetAuthorizationRecordsByAccessor(int accessorId);
        IQueryable<AuthorizationRecord> GetAllAuthorizationRecords();
        void AddAuthorizationRecord(AuthorizationRecord authorizationRecord);
        void UpdateAuthorizationRecord(AuthorizationRecord authorizationRecord);
        /*void AddDoctor(Doctor doctor);
        Doctor GetDoctorById(Guid id);
        void AddPatient(Patient patient);
        Patient GetPatientById(Guid id);*/
    }
}
