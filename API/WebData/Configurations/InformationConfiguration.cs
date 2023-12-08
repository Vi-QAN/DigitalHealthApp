using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using WebData.Models;

namespace WebData.Configurations
{
    public class InformationConfiguration : IEntityTypeConfiguration<Information>
    {
        public void Configure(EntityTypeBuilder<Information> builder)
        {
            builder.ToTable(nameof(Information))
                .HasKey(i => new { i.UserId, i.FileHash});

            builder.HasOne(i => i.User).WithMany(u => u.Information).HasForeignKey(i => i.UserId).IsRequired();

        }
    }
}
