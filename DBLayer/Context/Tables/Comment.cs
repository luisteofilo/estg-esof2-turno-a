using ESOF.WebApp.DBLayer.Entities;
using Microsoft.EntityFrameworkCore;

namespace ESOF.WebApp.DBLayer.Context;

public partial class ApplicationDbContext
{
    private void BuildComment(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Comment>(entity =>
        {
            entity.HasKey(e => e.comment_id); 
            
            entity.Property(e => e.comment).IsRequired();
            
            entity.HasOne(e => e.video)
                .WithMany(p => p.comments)
                .HasForeignKey(e => e.video);

            /*entity.HasOne(e => e.user)
                .WithMany(p => p.comments) 
                .HasForeignKey(e => e.user);*/
            
        });
    }
}