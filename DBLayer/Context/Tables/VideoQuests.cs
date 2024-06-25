using ESOF.WebApp.DBLayer.Entities;
using Microsoft.EntityFrameworkCore;

namespace ESOF.WebApp.DBLayer.Context;

public partial class ApplicationDbContext
{
    private void BuildVideoQuest(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<VideoQuests>(entity =>
        {
            entity.ToTable("VideoQuests", schema: "gametok");
            
            entity.HasKey(e => e.VideoQuestId); 
            
            entity.Property(e => e.Description).IsRequired();
            
            entity.Property(e => e.CreatedAt).IsRequired();
            
            entity.HasOne(c => c.Game)
                .WithMany(g => g.Challenges)
                .HasForeignKey(c => c.GameId);
            
            entity.HasMany(e => e.Videos)
                .WithOne(v => v.VideoQuests )
                .HasForeignKey(e => e.VideoId);
            
        });
    }
}