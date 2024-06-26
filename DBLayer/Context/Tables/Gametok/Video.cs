using ESOF.WebApp.DBLayer.Entities;
using Microsoft.EntityFrameworkCore;

namespace ESOF.WebApp.DBLayer.Context;

public partial class ApplicationDbContext
{
    private void BuildVideo(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Video>(entity =>
        {
            entity.ToTable("Videos", schema: "gametok");
            
            entity.Property(p => p.VideoId)
                .HasDefaultValueSql("gen_random_uuid()");
            
            entity.Property(e => e.VideoPath).IsRequired();
            
            entity.Property(e => e.Caption).IsRequired();
            
            entity.Property(e => e.ViewCount).HasDefaultValue(0);
            
            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("CURRENT_TIMESTAMP");
            
            entity.HasOne(e => e.VideoQuest)
                .WithMany(p => p.Videos)
                .HasForeignKey(e => e.VideoQuestId);
            
            entity.HasMany(e => e.Comments)
                .WithOne(v => v.Video )
                .HasForeignKey(e => e.VideoId);
            
            entity.HasMany(e => e.Likes)
                .WithOne(v => v.Video )
                .HasForeignKey(e => e.VideoId);
            
            // entity.HasOne(e => e.User)
            //     .WithMany(p => p.Videos)
            //     .HasForeignKey(e => e.UserId);
        });
    }
}