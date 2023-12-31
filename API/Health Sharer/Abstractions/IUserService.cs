using HealthSharer.Models;
using System.Collections.Generic;

namespace HealthSharer.Abstractions
{
    public interface IUserService
    {
        GetUserResponse Signup(SignupRequest request);
        GetUserResponse GetUser(string address);
        int AddAuthorization(AuthorizationRequest request);
        int RemoveAuthorization(AuthorizationRequest request);
        List<GetAuthorizationResponse> GetAuthorization(int userId);
    }
}
