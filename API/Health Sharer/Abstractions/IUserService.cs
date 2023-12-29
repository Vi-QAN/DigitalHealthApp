using HealthSharer.Models;
using System.Collections.Generic;

namespace HealthSharer.Abstractions
{
    public interface IUserService
    {
        int AddUser(AddUserRequest request);
        GetUserResponse GetUser(string address);
        int UpdateUser( AddUserRequest request);
        int AddAuthorization(AuthorizationRequest request);
        int RemoveAuthorization(AuthorizationRequest request);
        List<GetAuthorizationResponse> GetAuthorization(int userId);
    }
}
