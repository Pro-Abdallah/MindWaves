using Microsoft.EntityFrameworkCore;
using MindWaves.Data;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.



// 1. DbContext
builder.Services.AddDbContext<MindWavesDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("Asp")));



// 2. Add Cors
builder.Services.AddCors(options =>
{
    options.AddPolicy("FrontendOnly",
        policy =>
        {
            policy.WithOrigins("https://frontend.com")
                  .AllowAnyHeader()
                  .AllowAnyMethod();
        });
});




builder.Services.AddControllers();
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}


app.UseCors("FrontendOnly");


app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();
