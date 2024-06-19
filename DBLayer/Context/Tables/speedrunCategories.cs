using ESOF.WebApp.DBLayer.Entities;
using Microsoft.EntityFrameworkCore;

namespace ESOF.WebApp.DBLayer.Context;

public class speedrunCategories
{
    public void BuildSpeedrunCategory(ModelBuilder modelBuilder) 
    {
        modelBuilder.Entity<speedrunCategory>(entity =>
        {
            entity.HasKey(e => e.categoryID);

            entity.Property(e => e.gameID).IsRequired();

            entity.HasOne(e => e.Game)
                .WithMany()
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