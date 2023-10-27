using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using WebAPI.Abstractions;
using WebAPI.Services;
using WebData;
using WebData.Abstractions;
using WebData.Models;
using WebData.Repositories;
using Newtonsoft.Json;

namespace WebAPI
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            /*services.AddAuthentication("Bearer")
                .AddIdentityServerAuthentication("Bearer", options =>
                {
                    options.ApiName = "doctor";
                    options.Authority = "https://localhost:7089";
                    options.RequireHttpsMetadata = false;
                });*/
            var connectionString = Configuration.GetConnectionString("DefaultConnection");
            var migrationsAssembly = typeof(SeedData).Assembly.FullName;

            services.AddDbContext<DigitalHealthContext>(options =>
                options.UseSqlServer(connectionString, 
                    sqlOptions => sqlOptions.MigrationsAssembly(migrationsAssembly)));

            services.AddScoped<IUserService, UserService>();
            services.AddScoped<IConversationService, ConversationService>();
            services.AddScoped<IConversationRepository, ConversationRepository>();
            services.AddScoped<IUserRepository, UserRepository>();
            services.AddControllers();

            services.AddCors(options =>
            {
                options.AddPolicy("AllowOrigin", builder =>
                {
                    builder.WithOrigins("http://192.168.0.113:8081")
                           .AllowAnyHeader()
                           .AllowAnyMethod();
                });
            });
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }
            app.UseCors("AllowOrigin");
            app.UseRouting();

            //app.UseAuthentication();
            app.UseAuthorization();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
            });
        }
    }
}
