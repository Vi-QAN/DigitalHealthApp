using Azure;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Microsoft.Extensions.Hosting;
using System.Xml;
using WebData.Models;

namespace WebData.Configurations
{
    public class UserConfiguration : IEntityTypeConfiguration<User>
    {
        public void Configure(EntityTypeBuilder<User> builder)
        {
            builder.ToTable("Users").HasKey(x => x.Id);
            builder.Property(x => x.Id).ValueGeneratedOnAdd();
            builder.Property(x => x.PublicKey).IsRequired();

            builder
                .HasMany(x => x.AsOwnerRecords)
                .WithMany(x => x.AsAccessorRecords)
                .UsingEntity<AuthorizationRecord>(
                    l => l.HasOne<User>().WithMany().HasForeignKey("AccessorId").OnDelete(DeleteBehavior.NoAction),
                    r => r.HasOne<User>().WithMany().HasForeignKey("OwnerId").OnDelete(DeleteBehavior.NoAction),
                    t =>
                    {
                        t.HasKey(t => t.Id);
                        t.Property(t => t.Id).ValueGeneratedOnAdd(); 
                    }
                ) ;

            builder
                .HasMany(x => x.AsOwnerRecords)
                .WithMany(x => x.AsAccessorRecords)
                .UsingEntity<FileAuthorizationRecord>(
                    l => l.HasOne<User>().WithMany().HasForeignKey("AccessorId").OnDelete(DeleteBehavior.NoAction),
                    r => r.HasOne<User>().WithMany().HasForeignKey("OwnerId").OnDelete(DeleteBehavior.NoAction),
                    t =>
                    {
                        t.HasKey(t => t.Id);
                        t.Property(t => t.Id).ValueGeneratedOnAdd();
                    }
                ); 
        }
    }



    /*public class DoctorConfiguration : IEntityTypeConfiguration<Doctor>
    {
        public void Configure(EntityTypeBuilder<Doctor> builder)
        {
            builder.ToTable("Doctor").HasKey(x => x.Id);

            builder.Property(x => x.Id).HasDefaultValue(Guid.Empty).ValueGeneratedOnAdd();
            builder.Property(x => x.Name).IsRequired();

        }
    }

    public class PatientConfiguration : IEntityTypeConfiguration<Patient>
    {
        public void Configure(EntityTypeBuilder<Patient> builder)
        {
            builder.ToTable("Patient").HasKey(x => x.Id);

            builder.Property(x => x.Id).HasDefaultValue(Guid.Empty).ValueGeneratedOnAdd();
            builder.Property(x => x.Name).IsRequired();

        }
    }*/
}
