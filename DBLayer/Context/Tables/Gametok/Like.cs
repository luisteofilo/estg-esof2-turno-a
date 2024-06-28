using ESOF.WebApp.DBLayer.Entities;
using Microsoft.EntityFrameworkCore;

namespace ESOF.WebApp.DBLayer.Context;

    public partial class ApplicationDbContext
    {
        private void BuildLike(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Like>(entity =>
            {
                entity.ToTable("Likes", schema: "gametok");
                
                modelBuilder.Entity<Like>()
                    .HasKey(c => new { c.UserId, c.VideoId });
                
                entity.Property(e => e.CreatedAt)
                    .HasDefaultValueSql("CURRENT_TIMESTAMP");
            
                entity.HasOne(l => l.Video)
                    .WithMany(v => v.Likes)
                    .HasForeignKey(l => l.VideoId);

                // entity.HasOne(e => e.User)
                //     .WithMany(p => p.Likes)
                //     .HasForeignKey(e => e.UserId);
            });
        }
    }
