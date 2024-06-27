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
            .Property(r => r.UserId)
            .IsRequired();

        modelBuilder.Entity<Review>()
            .Property(r => r.GameId)
            .IsRequired();

        modelBuilder.Entity<Review>()
            .Property(r => r.Rating)
            .IsRequired();

        modelBuilder.Entity<Review>()
            .Property(r => r.WrittenReview)
            .IsRequired();

        modelBuilder.Entity<Review>()
            .Property(r => r.ApprovedStatus)
            .HasDefaultValue(false);

        modelBuilder.Entity<Review>()
            .Property(r => r.EditedStatus)
            .HasDefaultValue(false);

        modelBuilder.Entity<Review>()
            .Property(r => r.EditedDate)
            .IsRequired(false);

        modelBuilder.Entity<Review>()
            .Property(r => r.CreationDate)
            .HasDefaultValueSql("CURRENT_TIMESTAMP");

        modelBuilder.Entity<Review>()
            .HasOne(r => r.User)
            .WithMany(u => u.Reviews)
            .HasForeignKey(r => r.UserId)
            .HasConstraintName("id_user___fk");

        modelBuilder.Entity<Review>()
            .HasOne(r => r.Game)
            .WithMany(g => g.Reviews)
            .HasForeignKey(r => r.GameId)
            .HasConstraintName("id_game___fk");
    }
}