using ESOF.WebApp.DBLayer.Entities;
using Microsoft.EntityFrameworkCore;

namespace ESOF.WebApp.DBLayer.Context;

public partial class ApplicationDbContext
{
    private void BuildGames(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Game>()
            .HasKey(g => g.GameId);

        modelBuilder.Entity<Game>()
            .Property(g => g.GameId)
            .HasDefaultValueSql("gen_random_uuid()");
        
        modelBuilder.Entity<Game>()
            .Property(g => g.Title)
            .IsRequired();
    }
}