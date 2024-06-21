using ESOF.WebApp.DBLayer.Entities;
using Microsoft.EntityFrameworkCore;

namespace ESOF.WebApp.DBLayer.Context;

public partial class ApplicationDbContext
{
    private void BuildGame(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Game>(entity =>
        {
            entity.HasKey(e => e.game_id); 
            
            entity.Property(e => e.name).IsRequired();
            
            entity.Property(e => e.console).IsRequired();
            
            entity.HasMany(e => e.challenges)
                .WithOne(c => c.game )
                .HasForeignKey(e => e.challenge_id);
            
        });
    }
}