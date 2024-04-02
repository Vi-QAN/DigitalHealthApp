using HealthSharer;
using HealthSharer.Abstractions;
using HealthSharer.Services;
using Microsoft.EntityFrameworkCore;
using WebData;
using WebData.Abstractions;
using WebData.Repositories;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddDbContext<DigitalHealthContext>(options =>
                options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddScoped<IFileService, FileService>();
builder.Services.AddScoped<IUserService, UserService>();
builder.Services.AddScoped<IAuthorizationService, AuthorizationService>();
builder.Services.AddScoped<IContractService, ContractService>();
builder.Services.AddScoped<ILogService, LogService>();
builder.Services.AddScoped<IFileInformationService, FileInformationService>();
builder.Services.AddSingleton<ContractService>();
builder.Services.AddScoped<IAssistantService, AssistantService>();
builder.Services.AddScoped<IFileRepository, FileRepository>();
builder.Services.AddScoped<IUserRepository, UserRepository>();
builder.Services.AddScoped<ILogRepository, LogRepository>();
builder.Services.AddScoped<IAssistantRepository, AssistantRepository>();


builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowOrigin", builder =>
    {
        builder.WithOrigins("*")
               .AllowAnyHeader()
               .AllowAnyMethod()
               .WithExposedHeaders(new string[] { "Content-Disposition" } );
                
    });
});

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddLogging(builder => builder.AddConsole());   
builder.Services.AddLogging(builder => builder.AddEventSourceLogger());
builder.Services.AddLogging(builder => builder.AddDebug());

var app = builder.Build();

{
    using var scope = app.Services.CreateScope();
    var context = scope.ServiceProvider.GetRequiredService<DigitalHealthContext>();

    try
    {
        // Apply migrations to create/update the database
        context.Database.Migrate();
        Console.WriteLine("Database migration successful.");
        Seed.EnsureFileActions(context);
        Seed.EnsureFileModes(context);
        Seed.EnsureAvailableActions(context);

    } catch(Exception ex)
    {
        Console.WriteLine(ex.ToString());
    }
}


// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
    app.UseHttpsRedirection();
}
app.UseCors("AllowOrigin");

app.UseAuthorization();

app.MapControllers();

app.Run();
