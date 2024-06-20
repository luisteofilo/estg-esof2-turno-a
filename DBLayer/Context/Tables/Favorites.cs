using ESOF.WebApp.DBLayer.Entities;
using Microsoft.EntityFrameworkCore;

namespace ESOF.WebApp.DBLayer.Context;

// TODO: Implement context for the Favorites table
public partial class ApplicationDbContext
{
    private void BuildFavorites(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Favorite>()
            .HasKey(f => new { f.UserId, f.GameId });

        modelBuilder.Entity<Favorite>()
            .HasOne(f => f.User)
            .WithMany(u => u.Favorites)
            .HasForeignKey(f => f.UserId);

        modelBuilder.Entity<Favorite>()
            .HasOne(f => f.Game)
            .WithMany(g => g.Favorites)
            .HasForeignKey(f => f.GameId);
    }
}