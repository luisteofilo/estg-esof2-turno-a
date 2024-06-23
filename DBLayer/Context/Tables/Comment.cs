using ESOF.WebApp.DBLayer.Entities;
using Microsoft.EntityFrameworkCore;

public partial class ApplicationDbContext
{
    private void BuildComments(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Comment>()
            .Property(p => p.CommentId)
            .HasDefaultValueSql("gen_random_uuid()");
        
        modelBuilder.Entity<Comment>()
            .HasKey(c => c.CommentId);

        modelBuilder.Entity<Comment>()
            .HasOne(c => c.User)
            .WithMany(u => u.Comment)
            .HasForeignKey(c => c.UserId);

        modelBuilder.Entity<Comment>()
            .HasOne(c => c.Post)
            .WithMany(p => p.Comment)
            .HasForeignKey(c => c.PostId);
    }
}