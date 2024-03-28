using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Microsoft.VisualBasic;
using WebData.Models;
using FileMode = WebData.Models.FileMode;

namespace WebData.Configurations
{
    public class FileActionConfiguration : IEntityTypeConfiguration<FileAction>
    {
        public void Configure(EntityTypeBuilder<FileAction> builder)
        {
            builder.ToTable("FileActions").HasKey(x => x.Id);
            builder.Property(x => x.Id).ValueGeneratedOnAdd();
        }
    }

    public class FileModeConfiguration : IEntityTypeConfiguration<FileMode>
    {
        public void Configure(EntityTypeBuilder<FileMode> builder)
        {
            builder.ToTable("FileModes").HasKey(x => x.Id);
            builder.Property(x => x.Id).ValueGeneratedOnAdd();
        }
    }

    public class AvailableActionConfiguration : IEntityTypeConfiguration<AvailableAction>
    {
        public void Configure(EntityTypeBuilder<AvailableAction> builder)
        {
            builder.ToTable("AvailableActions").HasKey(x => new { x.FileModeId, x.FileActionId});

            builder.HasOne(i => i.FileMode).WithMany(u => u.AvailableActions).HasForeignKey(i => i.FileModeId).IsRequired().OnDelete(DeleteBehavior.Cascade);
            builder.HasOne(i => i.FileAction).WithMany(u => u.AvailableActions).HasForeignKey(i => i.FileActionId).IsRequired().OnDelete(DeleteBehavior.Cascade);
        }
    }

    public class FileInformationConfiguration : IEntityTypeConfiguration<FileInformation>
    {
        public void Configure(EntityTypeBuilder<FileInformation> builder)
        {
            builder.ToTable(nameof(FileInformation))
                .HasKey(i => i.Id);
            builder.Property(x => x.Id).ValueGeneratedOnAdd();

            builder.HasOne(i => i.Owner).WithMany(u => u.FileInformation).HasForeignKey(i => i.OwnerId).IsRequired().OnDelete(DeleteBehavior.NoAction);
            builder.HasOne(i => i.FileMode).WithMany(u => u.FileInformationList).HasForeignKey(i => i.FileModeId).IsRequired().OnDelete(DeleteBehavior.NoAction);
            builder.HasMany(i => i.FileAuthorizationRecords).WithOne(r => r.FileInformation).HasForeignKey(r => r.FileInformationId).IsRequired().OnDelete(DeleteBehavior.Cascade);
        }
    }

    public class FileNoteConfiguration : IEntityTypeConfiguration<FileNote>
    {
        public void Configure(EntityTypeBuilder<FileNote> builder)
        {
            builder.ToTable("File Notes").HasKey(i => i.Id);
            builder.Property(x => x.Id).ValueGeneratedOnAdd();

            builder.HasOne(f => f.User).WithMany(u => u.FileNotes).HasForeignKey(f => f.UserId).IsRequired().OnDelete(DeleteBehavior.NoAction);
            builder.HasOne(f => f.FileInformation).WithMany(f => f.FileNotes).HasForeignKey(f => f.FileInformationId).IsRequired().OnDelete(DeleteBehavior.NoAction);
        }
    }
    
    public class FileNoteAttachmentConfiguration : IEntityTypeConfiguration<FileNoteAttachment>
    {
        public void Configure(EntityTypeBuilder<FileNoteAttachment> builder)
        {
            builder.ToTable("Attachments").HasKey(i => i.Id);
            builder.Property(x => x.Id).ValueGeneratedOnAdd();

            builder.HasOne(f => f.Note).WithMany(u => u.Attachments).HasForeignKey(f => f.NoteId).IsRequired().OnDelete(DeleteBehavior.NoAction);
        }
    }

    public class FilesSummaryConfiguration : IEntityTypeConfiguration<FilesSummary>
    {
        public void Configure(EntityTypeBuilder<FilesSummary> builder)
        {
            builder.ToTable("FilesSummary").HasKey(x => x.Id);  
            builder.Property(x => x.Id).ValueGeneratedOnAdd();

            builder.HasOne(u => u.Owner).WithMany(s => s.FilesSummaries).HasForeignKey(s => s.OwnerId).IsRequired().OnDelete(DeleteBehavior.NoAction);
        }
    }

}
