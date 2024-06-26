using ESOF.WebApp.DBLayer.Entities;
using Microsoft.EntityFrameworkCore;

// ReSharper disable once CheckNamespace
namespace ESOF.WebApp.DBLayer.Context;

public partial class ApplicationDbContext
{
    private void BuildShops(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Shops>()
            .Property(s => s.ShopId)
            .HasDefaultValueSql("gen_random_uuid()");
        
        modelBuilder.Entity<Shops>(entity =>
        {
            entity.HasKey(e => e.ShopId);

            entity.Property(e => e.GameOfMonthId);

            entity.Property(e => e.Date)
                .IsRequired();

            entity.Property(e => e.GameId)
                .IsRequired();

            entity.HasOne(e => e.Game)
                .WithMany(g => g.Shops)
                .HasForeignKey(e => e.GameId);
        });
    }
}