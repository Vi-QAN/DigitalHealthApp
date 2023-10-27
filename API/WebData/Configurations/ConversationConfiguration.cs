using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Microsoft.EntityFrameworkCore;
using WebData.Models;

namespace WebData.Configurations
{
    public class ConversationConfiguration : IEntityTypeConfiguration<Conversation>
    {
        public void Configure(EntityTypeBuilder<Conversation> builder)
        {
            builder.ToTable("Conversation").HasKey(x => x.Id);

            builder.Property(x => x.Id).HasDefaultValue(Guid.Empty).ValueGeneratedOnAdd();
            builder.Property(x => x.CreatedDate).IsRequired();

            builder.HasOne(c => c.Patient).WithMany(p => p.Conversations).HasForeignKey(c => c.PatientId).IsRequired();
            builder.HasOne(c => c.Doctor).WithMany(p => p.Conversations).HasForeignKey(c => c.DoctorId).IsRequired();
            builder.HasMany(c => c.Messages).WithOne(m => m.Conversation).HasForeignKey(c => c.ConversationId).IsRequired();
        }
    }

    public class MessageConfiguration : IEntityTypeConfiguration<Message>
    {
        public void Configure(EntityTypeBuilder<Message> builder)
        {
            builder.ToTable("Message").HasKey(x => x.Id);

            builder.Property(x => x.Id).HasDefaultValue(Guid.Empty).ValueGeneratedOnAdd();
            builder.Property(x => x.SentDate).IsRequired();
            builder.Property(x => x.MessageHash).IsRequired();
        }
    }
}
