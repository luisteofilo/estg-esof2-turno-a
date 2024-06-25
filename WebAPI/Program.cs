using ESOF.WebApp.DBLayer.Context;
using ESOF.WebApp.DBLayer.Entities;
using Helpers.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
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

// Define endpoints
app.MapGet("/games", () =>
    {
        var db = new ApplicationDbContext();
        return db.Games.Select(g => new GamesViewModel
        {
            GameId = g.GameId,
            Name = g.Name,
            Description = g.Description,
            UrlImage = g.Url_Image,
            Developer = g.Developer,
            Publisher = g.Publisher
        }).ToArray();
    })
    .WithName("GetGames")
    .WithOpenApi();

app.MapGet("/games/{GameID:guid}", async (Guid GameID) =>
    {
        var db = new ApplicationDbContext();
        var roms = await db.Roms
            .Where(r => r.GameId == GameID)
            .Select(r => new RomsViewModel
            {
                RomId = r.RomId,
                GameId = r.GameId,
                ROM = r.ROM,
                File_name = r.File_name
            })
            .ToArrayAsync();

        return Results.Ok(roms);
    })
    .WithName("GetRoms")
    .WithOpenApi();

// Run the app

app.MapPost("/games", async (Games newGame) =>
    {
        var db = new ApplicationDbContext();

        var game = new Games
        {
            GameId = newGame.GameId,
            Name = newGame.Name,
            Description = newGame.Description,
            Url_Image = newGame.Url_Image,
            Developer = newGame.Developer,
            Publisher = newGame.Publisher,
            ReleaseDate = newGame.ReleaseDate,
            Price = newGame.Price
        };

        db.Games.Add(game);
        await db.SaveChangesAsync();
    })
    .WithName("AddGame")
    .WithOpenApi();


app.Run();


// WeatherForecast record (if needed)
record WeatherForecast(DateOnly Date, int TemperatureC, string? Summary)
{
    public int TemperatureF => 32 + (int)(TemperatureC / 0.5556);
}
