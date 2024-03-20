using HealthSharer.Models;
using WebData.Models;

namespace HealthSharer.Abstractions
{
    public interface IUserService
    {
        GetUserResponse Signup(SignupRequest request);
        GetUserResponse GetUser(string address);
        GetUserResponse GetUser(int userId);
        List<GetUserResponse> GetUsers();
    }
}
