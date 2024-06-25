using ESOF.WebApp.DBLayer.Entities;
using Microsoft.EntityFrameworkCore;

namespace ESOF.WebApp.DBLayer.Context;

public partial class ApplicationDbContext
{
    public void BuildSpeedrunCategories(ModelBuilder modelBuilder) 
    {
        modelBuilder.Entity<SpeedrunCategory>(entity =>
        {
            entity.HasKey(e => e.categoryID);

            entity.Property( e => e.categoryID)
                .HasDefaultValueSql("gen_random_uuid()" );
            
            entity.Property(e => e.gameID).IsRequired();

            entity.HasOne(e => e.Game)
                .WithMany(g => g.speedrunCategories)
                .HasForeignKey(e => e.gameID);

            entity.Property(e => e.creationDate).IsRequired();

            entity.Property(e => e.categoryName).IsRequired();

            entity.Property(e => e.categoryDescription).IsRequired();

            entity.Property(e => e.categoryRules).IsRequired();

            entity.HasMany(e => e.speedrunRuns)
                .WithOne(run => run.category)
                .HasForeignKey(run => run.categoryID);
            
        });
            
    }
}