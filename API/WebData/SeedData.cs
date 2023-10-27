using Microsoft.EntityFrameworkCore;
using Serilog;
using WebData.Models;

namespace WebData
{
    public class SeedData
    {
        public static void EnsureSeedData(string connectionString)
        {
            var services = new ServiceCollection();
            services.AddLogging();
            services.AddDbContext<DigitalHealthContext>(options =>
              options.UseSqlServer(connectionString));

            var serviceProvider = services.BuildServiceProvider();
            var scope = serviceProvider.GetRequiredService<IServiceScopeFactory>().CreateScope();
            var context = scope.ServiceProvider.GetService<DigitalHealthContext>();
            context.Database.Migrate();

            if (!context.Doctors.Any())
            {
                Log.Debug("Doctors being populated");
                context.Doctors.Add(new Doctor()
                {
                    Name = "Doctor 1",
                    Address = "Out the space"
                });
            }

            if (!context.Patients.Any()) {
                Log.Debug("Patients being populated");
                context.Patients.Add(new Patient()
                {
                    Name = "Patient 1",
                    Address = "Out the space",
                    Age = 30,
                    Sex = 1,
                    RegistrationDate = DateTime.UtcNow
                });
            }

            context.SaveChanges();
            
        }
    }
}
