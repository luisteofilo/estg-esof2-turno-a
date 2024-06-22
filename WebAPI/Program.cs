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

app.MapGet("/games", () =>
    {
        var db = new ApplicationDbContext();
        return db.Games;
    })
    .WithName("GetGames")
    .WithOpenApi();

app.MapGet("/games/{gameId:guid}", (Guid GameId) =>
    {
        var db = new ApplicationDbContext();
        return db.Games.Find(GameId);
    })
    .WithName("GetGamesById")
    .WithOpenApi();

app.MapFavoriteController();
app.Run();