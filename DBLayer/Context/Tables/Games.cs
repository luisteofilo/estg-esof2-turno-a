namespace ESOF.WebApp.DBLayer.Context;

using ESOF.WebApp.DBLayer.Entities;
using Microsoft.EntityFrameworkCore;

public partial class ApplicationDbContext{
    private void BuildGames(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Game>()
            .HasKey(g => g.GameId);
            
        modelBuilder.Entity<Game>()
            .Property(g => g.GameId)
            .HasDefaultValueSql("gen_random_uuid()");

        
        modelBuilder.Entity<Game>()
            .Property(g => g.Name)
            .IsRequired();
        
        modelBuilder.Entity<Game>()
            .Property(g => g.Description)
            .IsRequired();
    }
}