using ESOF.WebApp.DBLayer.Entities;
using Microsoft.EntityFrameworkCore;

namespace ESOF.WebApp.DBLayer.Context;

public partial class ApplicationDbContext
{
    private void BuildGame(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Game>(entity =>
        {
            entity.ToTable("Games", schema: "gametok");
            
            entity.HasKey(e => e.GameId); 
    
            entity.Property(e => e.Name).IsRequired();
    
            entity.Property(e => e.Console).IsRequired();
    
            entity.HasMany(e => e.Challenges)
                .WithOne(c => c.Game)
                .HasForeignKey(c => c.GameId);
        });
    }
}