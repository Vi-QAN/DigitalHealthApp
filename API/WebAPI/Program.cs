
using Microsoft.Extensions.Hosting;
using Serilog;
using WebAPI;
using WebData;

public class Program
{
    public static int Main(string[] args)
    {
        var seed = args.Contains("/seed");
        if (seed)
        {
            args = args.Except(new[] { "/seed" }).ToArray();
        }

        var host = CreateHostBuilder(args).Build();

        if (seed)
        {
            Log.Information("Seeding database...");
            var config = host.Services.GetRequiredService<IConfiguration>();
            var connectionString = config.GetConnectionString("DefaultConnection");
            SeedData.EnsureSeedData(connectionString);
            Log.Information("Done seeding database.");
        }

        Log.Information("Starting host...");
        host.Run();
        return 0;
    }

    public static IHostBuilder CreateHostBuilder(string[] args) =>
        Host.CreateDefaultBuilder(args)
            .ConfigureWebHostDefaults(webBuilder =>
            {
                webBuilder.UseIIS();
                webBuilder.UseStartup<Startup>();
            });
}