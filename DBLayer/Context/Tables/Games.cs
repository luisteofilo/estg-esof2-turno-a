using ESOF.WebApp.DBLayer.Entities;
using Microsoft.EntityFrameworkCore;

namespace ESOF.WebApp.DBLayer.Context;

// TODO: Implement context for the Games table
public partial class ApplicationDbContext
{
    private void BuildGames(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Game>()
            .HasMany(g => g.Favourites)
            .WithOne(f => f.Game)
            .HasForeignKey(f => f.GameId);

        modelBuilder.Entity<Game>()
            .HasIndex(g => g.Name)
            .IsUnique();

        modelBuilder.Entity<Game>()
            .Property(p => p.GameId)
            .HasDefaultValueSql("gen_random_uuid()");
    }
}