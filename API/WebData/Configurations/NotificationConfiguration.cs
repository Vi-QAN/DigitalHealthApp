using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Microsoft.EntityFrameworkCore;
using WebData.Models;

namespace WebData.Configurations
{
    public class NotificationConfiguration : IEntityTypeConfiguration<Notification>
    {
        public void Configure(EntityTypeBuilder<Notification> builder)
        {
            builder.ToTable("Notifications").HasKey(x => x.Id);
            builder.Property(x => x.Id).ValueGeneratedOnAdd();

            builder.Property(x => x.IsRead).IsRequired();
            builder.Property(x => x.CreatedDate).IsRequired();

            builder.HasOne(x => x.ActionLog).WithMany(x => x.Notifications).HasForeignKey(x => x.LogId).IsRequired().OnDelete(DeleteBehavior.Cascade);
            builder.HasOne(x => x.Recipient).WithMany(x => x.Notifications).HasForeignKey(x => x.RecipientId).IsRequired().OnDelete(DeleteBehavior.NoAction);
        }
    }

    public class ActionLogConfiguration : IEntityTypeConfiguration<ActionLog>
    {
        public void Configure(EntityTypeBuilder<ActionLog> builder)
        {
            builder.ToTable("ActionLogs").HasKey(x => x.Id);
            builder.Property(x => x.AddedDate).IsRequired();

            builder.HasOne(x => x.User).WithMany(x => x.ActionLogs).HasForeignKey(x => x.UserId).IsRequired().OnDelete(DeleteBehavior.NoAction);
            builder.HasOne(x => x.FileAction).WithMany(x => x.ActionLogs).HasForeignKey(x => x.FileActionId).IsRequired().OnDelete(DeleteBehavior.Cascade);
            builder.HasOne(x => x.FileInformation).WithMany(x => x.ActionLogs).HasForeignKey(x => x.InformationId).IsRequired().OnDelete(DeleteBehavior.Cascade);
        }
    }
}
