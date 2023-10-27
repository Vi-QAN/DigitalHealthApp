using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using WebData.Models;

namespace WebData.Configurations
{
    public class DeviceConfiguration : IEntityTypeConfiguration<Device>
    {
        public void Configure(EntityTypeBuilder<Device> builder)
        {
            builder.ToTable("Device").HasKey(x => x.Id);

            builder.Property(x => x.Id).HasDefaultValue(Guid.Empty).ValueGeneratedOnAdd();
        
            builder.HasOne(d => d.Patient).WithOne(p => p.Device).HasForeignKey<Device>(d => d.PatientId).IsRequired();
        }
    }

    public class SensorTypeConfiguration : IEntityTypeConfiguration<SensorType>
    {
        public void Configure(EntityTypeBuilder<SensorType> builder)
        {
            builder.ToTable("SensorType").HasKey(x => x.Id);

            builder.Property(x => x.Id).HasDefaultValue(Guid.Empty).ValueGeneratedOnAdd();
            builder.Property(x => x.Name).IsRequired();
        }
    }

    public class SensorValueConfiguration : IEntityTypeConfiguration<SensorValue>
    {
        public void Configure(EntityTypeBuilder<SensorValue> builder)
        {
            builder.ToTable("SensorValue").HasKey(x => new { x.SensorTypeId, x.DeviceId, x.RecordedDate });

            builder.HasOne(s => s.Device).WithMany(u => u.SensorValues).HasForeignKey(x => x.DeviceId);
            builder.HasOne(s => s.SensorType).WithMany(u => u.SensorValues).HasForeignKey(x => x.SensorTypeId);

        }
    }
}