using ESOF.WebApp.DBLayer.Entities;
using Microsoft.EntityFrameworkCore;

namespace ESOF.WebApp.DBLayer.Context;

public partial class ApplicationDbContext
{
    private void BuildComment(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Comment>(entity =>
        {
            entity.ToTable("Comments", schema: "gametok");
            
            modelBuilder.Entity<Comment>()
                .HasKey(c => new { c.UserId, c.VideoId });
            
            entity.Property(e => e.comment).IsRequired();
            
            entity.HasOne(e => e.Video)
                .WithMany(p => p.Comments)
                .HasForeignKey(e => e.VideoId);

            // entity.HasOne(e => e.User)
            //     .WithMany(p => p.Comments) 
            //     .HasForeignKey(e => e.UserId);
        });
    }
}