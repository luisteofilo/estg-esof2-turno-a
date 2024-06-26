using ESOF.WebApp.DBLayer.Context;
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
using ESOF.WebApp.WebAPI.Controllers;
=======
using ESOF.WebApp.DBLayer.Entities;
using Microsoft.AspNetCore.Mvc;
>>>>>>> parent of e555e4b (endpoints)
using Microsoft.EntityFrameworkCore;
=======
>>>>>>> parent of 59e745d (Grupo A18 - Games Crud (#27))
=======
>>>>>>> parent of 59e745d (Grupo A18 - Games Crud (#27))

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

app.MapGet("/users/emails", () =>
    {
        var db = new ApplicationDbContext();
        return db.Users.Select(u => u.Email);
    })
    .WithName("GetUsersNames")
    .WithOpenApi();

<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
app.MapEnumController();
=======
app.MapGet("/users", () =>
    {
        var db = new ApplicationDbContext();
        return db.Users;
    })
    .WithName("GetUsers")
    .WithOpenApi();

app.MapGet("/games", async () =>
    {
        var db = new ApplicationDbContext();
        var games = await db.Games
            .Select(g => new 
            {
                g.GameId,
                g.Name,
                g.Genre,
                g.Platform
            })
            .ToListAsync();
        return games;
    })
    .WithName("GetGames")
    .WithOpenApi();

app.MapGet("/games/{gameId:guid}", async (Guid GameId) =>
    {
        var db = new ApplicationDbContext();
        var game = await db.Games
            .Where(g => g.GameId == GameId)
            .Select(g => new 
            {
                g.GameId,
                g.Name,
                g.Genre,
                g.Platform
            })
            .FirstOrDefaultAsync();
        return game;
    })
    .WithName("GetGamesById")
    .WithOpenApi();

app.MapGet("/consoles", () =>
    {
        var consoles = Enum.GetNames(typeof(Consoles)).ToList();
        return consoles;
    })
    .WithName("GetConsoles")
    .WithOpenApi();

app.MapGet("/genres", () =>
    {
        var genres = Enum.GetNames(typeof(Genre)).ToList();
        return genres;
    })
    .WithName("GetGenres")
    .WithOpenApi();

>>>>>>> parent of e555e4b (endpoints)
app.MapFavoriteController();
app.Run();
=======
=======
>>>>>>> parent of 59e745d (Grupo A18 - Games Crud (#27))
app.Run();

record WeatherForecast(DateOnly Date, int TemperatureC, string? Summary)
{
    public int TemperatureF => 32 + (int)(TemperatureC / 0.5556);
}
>>>>>>> parent of 59e745d (Grupo A18 - Games Crud (#27))
