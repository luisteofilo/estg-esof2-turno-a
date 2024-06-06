using ESOF.WebApp.DBLayer.Entities;
using Microsoft.EntityFrameworkCore;

// ReSharper disable once CheckNamespace
namespace ESOF.WebApp.DBLayer.Context;

public partial class ApplicationDbContext
{
    private void BuildShops(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Shops>(entity =>
        {
            entity.HasKey(e => e.gameOfMonthId);

            entity.Property(e => e.date)
                .IsRequired();

            entity.Property(e => e.gameId)
                .IsRequired();

            entity.HasOne(e => e.Game)
                .WithMany(g => g.Shops)
                .HasForeignKey(e => e.gameId);
        });
    }
}