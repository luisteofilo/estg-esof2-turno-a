using ESOF.WebApp.DBLayer.Context;
using ESOF.WebApp.DBLayer.Entities;
using ESOF.WebApp.WebAPI.Controllers;
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

app.MapGet("/users/emails", () =>
    {
        var db = new ApplicationDbContext();
        return db.Users.Select(u => u.Email);
    })
    .WithName("GetUsersNames")
    .WithOpenApi();


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
                g.Consoles
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
                g.Consoles
            })
            .FirstOrDefaultAsync();
        return game;
    })
    .WithName("GetGamesById")
    .WithOpenApi();

app.MapEnumController();
app.MapFavoriteController();
app.Run();


