using Azure;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Microsoft.Extensions.Hosting;
using WebData.Models;

namespace WebData.Configurations
{
    public class UserConfiguration : IEntityTypeConfiguration<User>
    {
        public void Configure(EntityTypeBuilder<User> builder)
        {
            builder.ToTable("Users").HasKey(x => x.UserId);
            builder.Property(x => x.UserId).ValueGeneratedOnAdd();

            builder
                .HasMany(x => x.AccessedRecords)
                .WithMany(x => x.OwnedRecords)
                .UsingEntity<AuthorizationRecord>(
                    r => { 
                        r.HasKey(x => new { x.OwnerId, x.AccessorId });
                        r.HasOne<User>().WithMany(e => e.AuthorizationRecords);
                        r.HasOne<User>().WithMany(e => e.AuthorizationRecords);
                    }
                     
                ) ;
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
