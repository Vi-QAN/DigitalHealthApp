using System.ComponentModel.DataAnnotations.Schema;

namespace WebData.Models
{
    public class Identity
    {
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int UserId { get; set; }
    }
}
