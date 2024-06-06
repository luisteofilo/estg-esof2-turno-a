using ESOF.WebApp.DBLayer.Entities;
using Microsoft.EntityFrameworkCore;

// ReSharper disable once CheckNamespace
namespace ESOF.WebApp.DBLayer.Context;

public partial class ApplicationDbContext
{
    private void BuildGame(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Game>(entity =>
        {
            entity.HasKey(e => e.GameId);

            entity.Property(e => e.name)
                .IsRequired();

            entity.Property(e => e.releaseDate)
                .IsRequired();

            entity.Property(e => e.developer)
                .IsRequired();

            entity.Property(e => e.publisher)
                .IsRequired();

            entity.Property(e => e.description)
                .IsRequired();

            entity.Property(e => e.price)
                .IsRequired();

            entity.Property(e => e.os);

            entity.Property(e => e.processor);

            entity.Property(e => e.memory);

            entity.Property(e => e.graphics);

            entity.Property(e => e.network);

            entity.Property(e => e.storage);

            entity.Property(e => e.additionalNotes);

            entity.HasMany(e => e.Shops)
                .WithOne(s => s.Game)
                .HasForeignKey(s => s.gameId);
        });
    }
}