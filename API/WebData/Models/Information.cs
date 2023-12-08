namespace WebData.Models
{
    public class Information
    {
        public DateTime AddedDate { get; set; }
        public string FileHash { get; set; }
        public string MultiAddress { get; set; }
        public int UserId { get; set; }
        public string FileName { get; set; }
        public string FileExtension { get; set; }
        public string FileType { get; set; }
        public virtual User User { get; set; }

    }
}
