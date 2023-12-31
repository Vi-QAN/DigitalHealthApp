namespace HealthSharer.Models
{
    public class SignupRequest
    {
        public string UserName { get; set; }
        public string Key { get; set; }
    }

    public class AuthorizationRequest
    {
        public string OwnerId { get; set; }
        public string AccesserId { get; set; }
    }

}
