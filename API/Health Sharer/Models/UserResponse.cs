namespace HealthSharer.Models
{
    public class GetUserResponse
    {
        public int UserId { get; set; }
        public string Key { get; set; }
        public string? Name { get; set; }
    }

    public class GetAuthorizationResponse
    {
        public int AccessorId { get; set; }
        public string AccessorKey { get; set; }
        public string Name { get; set; }
        public bool IsAuthorized { get; set; }
        public DateTime AuthorizedDate { get; set; }
    }

    public class GetFileAuthorizationReponse
    {
        public int AccessorId { get; set; }
        public string AccessorName { get; set; }
        public DateTime AuthorizedDate { get; set; }
    }
}
