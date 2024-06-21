using ESOF.WebApp.DBLayer.Entities;
using Microsoft.EntityFrameworkCore;

namespace ESOF.WebApp.DBLayer.Context;

public partial class ApplicationDbContext
{
    private void BuildVideo(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Video>(entity =>
        {
            entity.HasKey(e => e.video_id); 
            
            entity.Property(e => e.caption).IsRequired();
            
            entity.HasOne(e => e.challenge)
                .WithMany(p => p.videos)
                .HasForeignKey(e => e.challenge);

            /*entity.HasOne(e => e.user)
                .WithMany(p => p.videos)
                .HasForeignKey(e => e.user);*/
            
            entity.HasMany(e => e.comments)
                .WithOne(v => v.video )
                .HasForeignKey(e => e.comment);
            
        });
    }
}