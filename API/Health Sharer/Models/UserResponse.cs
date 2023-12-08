namespace DigitalHealthService.Models
{
    public class GetUserResponse
    {
        public int UserId { get; set; }
        public string ContractAddress { get; set; }
    }

    public class GetAuthorizationResponse
    {
        public int AccessorId { get; set; }
        public string Name { get; set; }
        public bool IsAuthorized { get; set; }
    }
}
