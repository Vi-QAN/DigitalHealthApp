namespace DigitalHealthService.Models
{
    public class AddUserRequest
    {
        public string UserName { get; set; }
        public string ContractAddress { get; set; }
    }

    public class AuthorizationRequest
    {
        public int OwnerId { get; set; }
        public int AccesserId { get; set; }
    }

}
