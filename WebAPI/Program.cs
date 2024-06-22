using ESOF.WebApp.DBLayer.Context;
using ESOF.WebApp.DBLayer.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

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

app.MapGet("/users/emails", () =>
    {
        var db = new ApplicationDbContext();
        return db.Users.Select(u => u.Email);
    })
    .WithName("GetUsersNames")
    .WithOpenApi();

app.MapGet("/mods", () =>
    {
        var db = new ApplicationDbContext();
        return db.Mods
            .Include(m => m.Tags)  // Make sure to include tags
            .Select(m => new {
                m.ModId,
                m.Name,
                m.Game,
                m.Description,
                m.ReleaseDate,
                m.Author,
                m.Version,
                m.DownloadLink,
                m.DownloadCount,
                m.Rating,
                Tags = m.Tags.Select(t => new { t.TagId, t.Name, t.Description }).ToList()  // Project tags into a simpler format
            })
            .ToList();
    })
    .WithName("GetMods")
    .WithOpenApi();

app.MapGet("/tags", () =>
    {
        var db = new ApplicationDbContext();
        return db.ModTags.Select(u => u);
    })
    .WithName("GetTags")
    .WithOpenApi();

app.MapGet("/mod/{modId:guid}", (Guid modId) =>
    {
        var db = new ApplicationDbContext();
        var mod = db.Mods
            .Include(m => m.Tags)  // Make sure to include tags
            .Where(m => m.ModId == modId)
            .Select(m => new {
                m.ModId,
                m.Name,
                m.Game,
                m.Description,
                m.ReleaseDate,
                m.Author,
                m.Version,
                m.DownloadLink,
                m.DownloadCount,
                m.Rating,
                Tags = m.Tags.Select(t => new { t.TagId, t.Name, t.Description }).ToList()  // Project tags into a simpler format
            })
            .FirstOrDefault();

        if (mod == null)
        {
            return Results.NotFound();
        }

        return Results.Ok(mod);
    })
    .WithName("GetModById")
    .WithOpenApi();

app.MapPost("/mods", async (Mod mod) =>
    {
        using var db = new ApplicationDbContext();  // Create a new instance of ApplicationDbContext
        db.Mods.Add(mod);
        await db.SaveChangesAsync();
        return Results.Created($"/mods/{mod.ModId}", mod);
    })
    .WithName("AddMod")
    .WithOpenApi();

app.Run();

record WeatherForecast(DateOnly Date, int TemperatureC, string? Summary)
{
    public int TemperatureF => 32 + (int)(TemperatureC / 0.5556);
}