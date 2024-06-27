using ESOF.WebApp.DBLayer.Entities;
using Microsoft.EntityFrameworkCore;

namespace ESOF.WebApp.DBLayer.Context;

public partial class ApplicationDbContext
{
    private void BuildVideoQuest(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<VideoQuest>(entity =>
        {
            entity.ToTable("VideoQuests", schema: "gametok");
            
            entity.Property(p => p.VideoQuestId)
                .HasDefaultValueSql("gen_random_uuid()");
            
            entity.Property(e => e.Description).IsRequired();
            
            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("CURRENT_TIMESTAMP");
            
            entity.HasOne(c => c.Game)
                .WithMany(g => g.VideoQuests)
                .HasForeignKey(c => c.GameId);
            
            entity.HasMany(e => e.Videos)
                .WithOne(v => v.VideoQuest )
                .HasForeignKey(e => e.VideoId);
            
        });
    }
}