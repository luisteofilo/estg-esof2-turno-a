using ESOF.WebApp.DBLayer.Entities;
using Microsoft.EntityFrameworkCore;

namespace ESOF.WebApp.DBLayer.Context;

public partial class ApplicationDbContext
{
    private void BuildChallenge(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Challenge>(entity =>
        {
            entity.HasKey(e => e.challenge_id); 
            
            entity.Property(e => e.description).IsRequired();
            
            entity.Property(e => e.created_at).IsRequired();
            
            entity.HasOne(e => e.game)
                .WithMany(p => p.challenges)
                .HasForeignKey(e => e.game);
            
            entity.HasMany(e => e.videos)
                .WithOne(v => v.challenge )
                .HasForeignKey(e => e.video_id);
            
        });
    }
}