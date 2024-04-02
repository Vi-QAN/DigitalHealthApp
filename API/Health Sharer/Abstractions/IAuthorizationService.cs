using HealthSharer.Models;
using WebData.Models;

namespace HealthSharer.Abstractions
{
    public interface IAuthorizationService
    {
        GetAuthorizationResponse AddAuthorization(AuthorizationRequest request);
        int RemoveAuthorization(AuthorizationRequest request);
        List<GetAuthorizationResponse> GetAuthorization(int userId);
        List<GetAllInformationResponse> GetAuthorizationRecordsByAccessor(int accessorId);
        List<AuthorizationRecord> GetAllAuthorizationRecords();

        List<GetFileAuthorizationReponse> GetFileAuthorizationRecords(int fileId);
        void RemoveFileAuthorization(int recordId);
        void AddFileAuthorization(FileAuthorizationRequest request);
    }
}
