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
        public string AccessorId { get; set; }
    }

    public class FileAuthorizationRequest
    {
        public int OwnerId { get; set; }
        public int AccessorId { get; set; }
        public int FileId { get; set; }
    }


}
