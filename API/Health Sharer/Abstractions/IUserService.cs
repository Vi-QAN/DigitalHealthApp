using DigitalHealthService.Models;

namespace DigitalHealthService.Abstractions
{
    public interface IUserService
    {
        int AddUser(AddUserRequest request);
        GetUserResponse GetUser(int id);
        int UpdateUser( AddUserRequest request);
        int AddAuthorization(AuthorizationRequest request);
        int RemoveAuthorization(AuthorizationRequest request);
        List<GetAuthorizationResponse> GetAuthorization(int userId);
    }
}
