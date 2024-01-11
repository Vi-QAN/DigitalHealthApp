namespace HealthSharer.Models
{
    public class RandomSeed
    {
        public byte[] key {  get; set; }
        public byte[] iv { get; set; }
    }

    public class IPFSAddResponse
    {
        public string Name { get; set; }
        public string Hash { get; set; }
        public int Size { get; set; }
    }

    public class GetFileResponse
    {
        public byte[] Content { get; set; }
        public string ContentType { get; set; }
        public string FileName { get; set; }
    }
}
