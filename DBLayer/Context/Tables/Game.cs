using ESOF.WebApp.DBLayer.Entities;
using Microsoft.EntityFrameworkCore;

// ReSharper disable once CheckNamespace
namespace ESOF.WebApp.DBLayer.Context;

public partial class ApplicationDbContext
{
    private void BuildGame(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Game>()
            .Property(g => g.GameId)
            .HasDefaultValueSql("gen_random_uuid()");
        
        modelBuilder.Entity<Game>(entity =>
        {
            entity.HasKey(e => e.GameId);

            entity.Property(e => e.Name)
                .IsRequired();

            entity.Property(e => e.ReleaseDate)
                .IsRequired();

            entity.Property(e => e.Developer)
                .IsRequired();

            entity.Property(e => e.Publisher)
                .IsRequired();

            entity.Property(e => e.Description)
                .IsRequired();

            entity.Property(e => e.Price)
                .IsRequired();

            entity.HasMany(e => e.Shops)
                .WithOne(s => s.Game)
                .HasForeignKey(s => s.GameId);
        });
    }
}