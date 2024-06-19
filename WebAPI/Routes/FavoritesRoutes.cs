using ESOF.WebApp.DBLayer.Context;
using ESOF.WebApp.DBLayer.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

public static class FavoriteRoutes
{
    public static void MapFavoriteRoutes(this WebApplication app)
    {
        app.MapGet("/favorites", () =>
        {
            var db = new ApplicationDbContext();
            return db.Favourites;
        })
        .WithName("GetFavorites")
        .WithOpenApi();

        app.MapGet("/favorites/{userId:guid}", async ([FromServices] ApplicationDbContext db, Guid userId) =>
        {
            var favourites = await db.Favourites
                .Where(f => f.UserId == userId)
                .Select(f => new { f.UserId, f.GameId, f.Game })
                .ToListAsync();
            return favourites == null ? Results.NotFound() : Results.Ok(favourites);
        })
        .WithName("GetUserFavorites")
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
    }
}