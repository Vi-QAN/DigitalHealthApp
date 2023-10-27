using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using WebData.Models;

namespace WebData.Configurations
{

    public class DoctorConfiguration : IEntityTypeConfiguration<Doctor>
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
    }
}
