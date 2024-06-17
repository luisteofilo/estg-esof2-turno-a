using ESOF.WebApp.DBLayer.Entities;
using Microsoft.EntityFrameworkCore;

// ReSharper disable once CheckNamespace
namespace ESOF.WebApp.DBLayer.Context;

public partial class ApplicationDbContext
{
    private void BuildReviews(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Review>()
            .HasKey(r => r.ReviewId);
        
        modelBuilder.Entity<Review>()
            .Property(r => r.ReviewId)
            .HasDefaultValueSql("gen_random_uuid()");

        modelBuilder.Entity<Review>()
            .Property(r => r.Evaluation)
            .IsRequired();

        modelBuilder.Entity<Review>()
            .Property(r => r.UserId)
            .IsRequired();

        modelBuilder.Entity<Review>()
            .Property(r => r.GameId)
            .IsRequired();

        modelBuilder.Entity<Review>()
            .HasOne(e => e.User)
            .WithMany(u => u.Reviews)
            .HasForeignKey(e => e.UserId)
            .HasConstraintName("id_user___fk");

        modelBuilder.Entity<Review>()
            .HasOne(e => e.Game)
            .WithMany(g => g.Reviews)
            .HasForeignKey(e => e.GameId)
            .HasConstraintName("id_game___fk");
    }
}