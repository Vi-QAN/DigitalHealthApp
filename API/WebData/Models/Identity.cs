using System.ComponentModel.DataAnnotations.Schema;

namespace WebData.Models
{
    public class Identity
    {
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public Guid Id { get; set; }
    }
}
