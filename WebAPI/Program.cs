using ESOF.WebApp.DBLayer.Context;
using ESOF.WebApp.DBLayer.Entities;
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

app.MapGet("/Games", () =>
    {
        var db = new ApplicationDbContext();
        return  db.Games;
    })
    .WithName("GetGames")
    .WithOpenApi();

app.MapGet("/Reviews", () =>
    {
        var db = new ApplicationDbContext();
        return  db.Reviews;
    })
    .WithName("GetReviews")
    .WithOpenApi();

app.MapGet("/Reviews/{gameId}", async (string gameId) =>
    {
        var db = new ApplicationDbContext();
        var reviews = await db.Reviews.Where(r => r.GameId.ToString() == gameId).ToListAsync();
        return  reviews;
    })
    .WithName("GetReviewsFromGame")
    .WithOpenApi();

app.MapGet("/Games/{gameId}", async (string gameId) =>
    {
        var db = new ApplicationDbContext();
        var game = await db.Games.FirstAsync(g => g.GameId.ToString() == gameId);
        
        return  game;
    })
    .WithName("GetGameName")
    .WithOpenApi();

app.MapGet("/Users/{userid}", async (string userid) =>
    {
        var db = new ApplicationDbContext();
        var user = await db.Users.FirstAsync(u => u.UserId.ToString() == userid);
        
        return  user;
    })
    .WithName("GetUserBuId")
    .WithOpenApi();

app.Run();

record WeatherForecast(DateOnly Date, int TemperatureC, string? Summary)
{
    public int TemperatureF => 32 + (int)(TemperatureC / 0.5556);
}