using ESOF.WebApp.DBLayer.Entities;
using Microsoft.EntityFrameworkCore;


namespace ESOF.WebApp.DBLayer.Context;

public partial class ApplicationDbContext
{
    private void BuildPosts(ModelBuilder modelBuilder)
    {
        
        modelBuilder.Entity<Post>()
            .Property(p => p.PostId)
            .HasDefaultValueSql("gen_random_uuid()");
        
       
        modelBuilder.Entity<Post>()
            .HasOne(c => c.Game)
            .WithMany(p => p.Post)
            .HasForeignKey(c => c.GameId);
        
          
        modelBuilder.Entity<Post>()
            .HasOne(c => c.User)
            .WithMany(p => p.Post)
            .HasForeignKey(c => c.UserId);


    }
}