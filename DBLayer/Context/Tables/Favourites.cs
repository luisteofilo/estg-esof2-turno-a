using ESOF.WebApp.DBLayer.Entities;
using Microsoft.EntityFrameworkCore;

namespace ESOF.WebApp.DBLayer.Context;

// TODO: Implement context for the Favourites table
public partial class ApplicationDbContext
{
    private void BuildFavourites(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Favourite>()
            .HasKey(f => new { f.UserId, f.GameId });

        modelBuilder.Entity<Favourite>()
            .HasOne(f => f.User)
            .WithMany(u => u.Favourites)
            .HasForeignKey(f => f.UserId);

        modelBuilder.Entity<Favourite>()
            .HasOne(f => f.Game)
            .WithMany(g => g.Favourites)
            .HasForeignKey(f => f.GameId);
    }
}