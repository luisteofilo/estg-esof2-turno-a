using ESOF.WebApp.DBLayer.Context;
using Microsoft.EntityFrameworkCore;
using DotNetEnv;
using ESOF.WebApp.DBLayer.Entities;
using Microsoft.AspNetCore.Mvc;

var builder = WebApplication.CreateBuilder(args);

// Load environment variables from .env file
DotNetEnv.Env.Load();

// Configure PostgreSQL connection string from environment variables
var connectionString = $"Host={Env.GetString("POSTGRES_HOST")};" +
                      $"Database={Env.GetString("POSTGRES_DB")};" +
                      $"Username={Env.GetString("POSTGRES_USER")};" +
                      $"Password={Env.GetString("POSTGRES_PASSWORD")};" +
                      $"Port={Env.GetString("POSTGRES_PORT")}";

builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseNpgsql(connectionString));

// Add services to the container.
builder.Services.AddControllers();
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
app.UseAuthorization();

app.MapControllers();

app.MapGet("/api/userid", () =>
{
    try
    {
        // Definindo um ID de usuário estático para teste
        var userId = "b3e09754-8a49-41e8-a601-17fc29cd4985";
        return Results.Ok(userId);
    }
    catch (Exception ex)
    {
        // Log the exception details
        Console.WriteLine($"Error in /api/userid: {ex.Message}");
        Console.WriteLine($"Stack Trace: {ex.StackTrace}");
        return Results.Problem("An error occurred while processing your request.");
    }
}).WithName("GetUserId").WithOpenApi();



app.MapGet("/api/friends/{userId}", async (Guid userId, ApplicationDbContext db) =>
{
    try
    {
        var friendships = await db.Friendships
            .Where(f => f.UserId1 == userId || f.UserId2 == userId)
            .Include(f => f.User1)
            .Include(f => f.User2)
            .ToListAsync();
        return Results.Ok(friendships);
    }
    catch (Exception ex)
    {
        // Log the exception details
        Console.WriteLine($"Error in /api/friends/{userId}: {ex.Message}");
        Console.WriteLine($"Stack Trace: {ex.StackTrace}");
        return Results.Problem("An error occurred while processing your request.");
    }
}).WithName("GetFriends").WithOpenApi();

app.MapGet("/api/users/search", async (string email, ApplicationDbContext db) =>
{
    try
    {
        var user = await db.Users.FirstOrDefaultAsync(u => u.Email == email);
        if (user == null)
        {
            return Results.NotFound();
        }
        return Results.Ok(user);
    }
    catch (Exception ex)
    {
        // Log the exception details
        Console.WriteLine($"Error in /api/users/search: {ex.Message}");
        Console.WriteLine($"Stack Trace: {ex.StackTrace}");
        return Results.Problem("An error occurred while processing your request.");
    }
}).WithName("SearchFriend").WithOpenApi();

app.MapPost("/api/friends/request", async (Friendship friendship, [FromHeader(Name = "X-User-Id")] string userId, ApplicationDbContext db) =>
{
    try
    {
        if (string.IsNullOrEmpty(userId))
        {
            return Results.Unauthorized();
        }

        friendship.UserId1 = Guid.Parse(userId);
        friendship.Status = FriendshipStatus.Pending;
        db.Friendships.Add(friendship);
        await db.SaveChangesAsync();
        return Results.Ok();
    }
    catch (Exception ex)
    {
        // Log the exception details
        Console.WriteLine($"Error in /api/friends/request: {ex.Message}");
        Console.WriteLine($"Stack Trace: {ex.StackTrace}");
        return Results.Problem("An error occurred while processing your request.");
    }
}).WithName("SendFriendRequest").WithOpenApi();

app.MapPost("/api/friends/accept", async (Friendship friendship, ApplicationDbContext db) =>
{
    try
    {
        var existingFriendship = await db.Friendships.FirstOrDefaultAsync(f => f.FriendshipId == friendship.FriendshipId);
        if (existingFriendship != null)
        {
            existingFriendship.Status = FriendshipStatus.Accepted;
            await db.SaveChangesAsync();
        }
        return Results.Ok();
    }
    catch (Exception ex)
    {
        // Log the exception details
        Console.WriteLine($"Error in /api/friends/accept: {ex.Message}");
        Console.WriteLine($"Stack Trace: {ex.StackTrace}");
        return Results.Problem("An error occurred while processing your request.");
    }
}).WithName("AcceptFriendRequest").WithOpenApi();

app.MapPost("/api/friends/remove", async (Friendship friendship, ApplicationDbContext db) =>
{
    try
    {
        var existingFriendship = await db.Friendships.FirstOrDefaultAsync(f => f.FriendshipId == friendship.FriendshipId);
        if (existingFriendship != null)
        {
            existingFriendship.Status = FriendshipStatus.Removed;
            await db.SaveChangesAsync();
        }
        return Results.Ok();
    }
    catch (Exception ex)
    {
        // Log the exception details
        Console.WriteLine($"Error in /api/friends/remove: {ex.Message}");
        Console.WriteLine($"Stack Trace: {ex.StackTrace}");
        return Results.Problem("An error occurred while processing your request.");
    }
}).WithName("RemoveFriend").WithOpenApi();

app.Run();
