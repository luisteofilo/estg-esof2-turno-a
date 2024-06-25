using ESOF.WebApp.DBLayer.Context;
using ESOF.WebApp.DBLayer.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

public static class FavoriteController
{
    public static void MapFavoriteController(this WebApplication app)
    {
        app.MapGet("/favorites/user/{userId:guid}", async ([FromServices] ApplicationDbContext db, Guid userId) =>
            {
                var Favorites = await db.Favorites
                    .Where(f => f.UserId == userId)
                    .Select(f => new { f.UserId, f.GameId })  // Only select UserId and GameId
                    .ToListAsync();
                return Favorites == null ? Results.NotFound() : Results.Ok(Favorites);
            })
            .WithName("GetUserFavorites")
            .WithOpenApi();

        app.MapGet("/favorites/game/{gameId:guid}", async ([FromServices] ApplicationDbContext db, Guid gameId) =>
            {
                var Favorites = await db.Favorites
                    .Where(f => f.GameId == gameId)
                    .Select(f => new { f.UserId, f.GameId })  // Only select UserId and GameId
                    .ToListAsync();
                return Favorites == null ? Results.NotFound() : Results.Ok(Favorites);
            })
            .WithName("GetGameFavorites")
            .WithOpenApi();

        // Add game to favorites
        app.MapPost("/favorites/{userId:guid}/{gameId:guid}", async ([FromServices] ApplicationDbContext db, Guid userId, Guid gameId) =>
            {
                var existingfavorite = await db.Favorites.FindAsync(userId, gameId);
                if (existingfavorite != null)
                {
                    return Results.Conflict("Este favorito já existe.");
                }

                var favorite = new Favorite { UserId = userId, GameId = gameId };
                db.Favorites.Add(favorite);
                await db.SaveChangesAsync();
    
                // Project the favorite into a new object that doesn't include the navigation properties
                var result = new
                {
                    favorite.UserId,
                    favorite.GameId
                };

                return Results.Created($"/favorites/{result.UserId}/{result.GameId}", result);
            })
            .WithName("AddFavorite")
            .WithOpenApi();

        // Remove game from favorites
        app.MapDelete("/favorites/{userId:guid}/{gameId:guid}", async ([FromServices] ApplicationDbContext db, Guid userId, Guid gameId) =>
        {
            var favorite = await db.Favorites.FindAsync(userId, gameId);
            if (favorite == null)
            {
                return Results.NotFound();
            }

            db.Favorites.Remove(favorite);
            await db.SaveChangesAsync();
            return Results.NoContent();
        })
        .WithName("RemoveFavorite")
        .WithOpenApi();
    }
}