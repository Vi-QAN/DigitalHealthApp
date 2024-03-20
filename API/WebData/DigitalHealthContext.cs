using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using WebData.Configurations;
using WebData.Models;
using FileMode = WebData.Models.FileMode;

namespace WebData
{
    public class DigitalHealthContext : DbContext
    {
        /*public DbSet<Doctor> Doctors { get; set; }
        public DbSet<Patient> Patients { get; set; }
        public DbSet<Conversation> Conversations { get; set; }
        public DbSet<Message> Messages { get; set; }
        public DbSet<SensorType> SensorTypes { get; set; }
        public DbSet<SensorValue> SensorValues { get; set; }
        public DbSet<Device> Devices { get; set; }*/
        public DbSet<FileInformation> FileInformation { get; set; }
        public DbSet<User> Users { get; set; }  
        public DbSet<AuthorizationRecord> AuthorizationRecords { get; set; }
        public DbSet<FileAction> FileActions { get; set; }
        public DbSet<FileMode> FileModes { get; set; }
        public DbSet<AvailableAction> AvailableActions { get; set; }
        public DbSet<Notification> Notifications { get; set; }
        public DbSet<ActionLog> ActionLogs { get; set; }
        public DbSet<FileAuthorizationRecord> FileAuthorizationRecords { get; set; }
        public DbSet<FileNote> FileNotes { get; set; }
        public DbSet<FileNoteAttachment> FileNoteAttachments { get; set; }

        public DigitalHealthContext(DbContextOptions<DigitalHealthContext> options)
            : base(options)
        {
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            /*modelBuilder.ApplyConfiguration(new ConversationConfiguration());
            modelBuilder.ApplyConfiguration(new DoctorConfiguration());
            modelBuilder.ApplyConfiguration(new PatientConfiguration());
            modelBuilder.ApplyConfiguration(new SensorValueConfiguration());
            modelBuilder.ApplyConfiguration(new DeviceConfiguration());
            modelBuilder.ApplyConfiguration(new MessageConfiguration());*/
            modelBuilder.ApplyConfiguration(new FileInformationConfiguration());
            modelBuilder.ApplyConfiguration(new UserConfiguration());
            modelBuilder.ApplyConfiguration(new FileActionConfiguration());
            modelBuilder.ApplyConfiguration(new FileModeConfiguration());
            modelBuilder.ApplyConfiguration(new AvailableActionConfiguration());
            modelBuilder.ApplyConfiguration(new NotificationConfiguration());
            modelBuilder.ApplyConfiguration(new ActionLogConfiguration());
            modelBuilder.ApplyConfiguration(new FileNoteConfiguration());
            modelBuilder.ApplyConfiguration(new FileNoteAttachmentConfiguration());
        }

    }
}
