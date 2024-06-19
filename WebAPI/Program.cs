using ESOF.WebApp.DBLayer.Context;
using ESOF.WebApp.DBLayer.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

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

app.MapGet("/favorites", () =>
    {
        var db = new ApplicationDbContext();
        return db.Favourites;
    })
    .WithName("GetFavorites")
    .WithOpenApi();

app.MapGet("/games", () =>
    {
        var db = new ApplicationDbContext();
        return db.Games;
    })
    .WithName("GetGames")
    .WithOpenApi();

// Add game to favorites
app.MapPost("/favorites/{userId:guid}/{gameId:guid}", async ([FromServices] ApplicationDbContext db, Guid userId, Guid gameId) =>
    {
        var existingFavourite = await db.Favourites.FindAsync(userId, gameId);
        if (existingFavourite != null)
        {
            return Results.Conflict("Este favorito já existe.");
        }

        var favourite = new Favourite { UserId = userId, GameId = gameId };
        db.Favourites.Add(favourite);
        await db.SaveChangesAsync();
        return Results.Created($"/favorites/{favourite.UserId}/{favourite.GameId}", favourite);
    })
    .WithName("AddFavorite")
    .WithOpenApi();

// Remove game from favorites
app.MapDelete("/favorites/{userId:guid}/{gameId:guid}", async ([FromServices] ApplicationDbContext db, Guid userId, Guid gameId) =>
    {
        var favourite = await db.Favourites.FindAsync(userId, gameId);
        if (favourite == null)
        {
            return Results.NotFound();
        }

        db.Favourites.Remove(favourite);
        await db.SaveChangesAsync();
        return Results.NoContent();
    })
    .WithName("RemoveFavorite")
    .WithOpenApi();

app.Run();

record WeatherForecast(DateOnly Date, int TemperatureC, string? Summary)
{
    public int TemperatureF => 32 + (int)(TemperatureC / 0.5556);
}