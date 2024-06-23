using ESOF.WebApp.DBLayer.Context;
using ESOF.WebApp.DBLayer.Entities;
using Helpers.Models;
using Microsoft.EntityFrameworkCore.ValueGeneration.Internal;

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


app.MapGet("/games", () =>
    {
        var db = new ApplicationDbContext();
        return db.Games.Select(g => new GamesViewModel(
        ){
            
            GameId = g.GameId,
            Name=g.Name,
            Description = g.Description,
            UrlImage= g.Url_Image,
            Developer = g.Developer,
            Publisher = g.Publisher
                
            
        }).ToArray();
    })
    .WithName("GetGames")
    .WithOpenApi();

app.Run();

record WeatherForecast(DateOnly Date, int TemperatureC, string? Summary)
{
    public int TemperatureF => 32 + (int)(TemperatureC / 0.5556);
}