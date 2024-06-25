using ESOF.WebApp.DBLayer.Context;
using ESOF.WebApp.DBLayer.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

// Add Authorization services
builder.Services.AddAuthorization();

// Add Controller services
builder.Services.AddControllers();

// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "My API V1");
        c.RoutePrefix = string.Empty; // Define o Swagger UI como a página inicial
    });
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

var summaries = new[]
{
    "Freezing", "Bracing", "Chilly", "Cool", "Mild", "Warm", "Balmy", "Hot", "Sweltering", "Scorching"
};

app.MapGet("/weatherforecast", () =>
{
    var forecast = Enumerable.Range(1, 5).Select(index =>
        new WeatherForecast
        (
            DateOnly.FromDateTime(DateTime.Now.AddDays(index)),
            Random.Shared.Next(-20, 55),
            summaries[Random.Shared.Next(summaries.Length)]
        ))
    .ToArray();
    return forecast;
})
.WithName("GetWeatherForecast")
.WithOpenApi();

app.MapGet("/users/emails", async (ApplicationDbContext db) =>
{
    return await db.Users.Select(u => u.Email).ToListAsync();
})
.WithName("GetUsersNames")
.WithOpenApi();

app.MapGet("/users", async (ApplicationDbContext db) =>
{
    return await db.Users.ToListAsync();
})
.WithName("GetUsers")
.WithOpenApi();

app.MapGet("/games", async (ApplicationDbContext db) =>
{
    return await db.Games.ToListAsync();
})
.WithName("GetGames")
.WithOpenApi();

app.MapGet("/api/gamereport/order", async (ApplicationDbContext db, [FromQuery] string orderBy) =>
{
    IQueryable<Game> query = (IQueryable<Game>)db.Games;

    switch (orderBy.ToLower())
    {
        case "name":
            query = query.OrderBy(g => g.Name);
            break;
        case "genre":
            query = query.OrderBy(g => g.Genre);
            break;
        case "platform":
            query = query.OrderBy(g => g.Platform);
            break;
        case "releasedate":
            query = query.OrderBy(g => g.ReleaseDate);
            break;
        default:
            query = query.OrderBy(g => g.Name);
            break;
    }

    return await query.ToListAsync();
})
.WithName("GetOrderedGames")
.WithOpenApi();

app.Run();

record WeatherForecast(DateOnly Date, int TemperatureC, string? Summary)
{
    public int TemperatureF => 32 + (int)(TemperatureC / 0.5556);
}
