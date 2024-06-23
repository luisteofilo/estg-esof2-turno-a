using ESOF.WebApp.DBLayer.Entities;
using Microsoft.EntityFrameworkCore;

// ReSharper disable once CheckNamespace
namespace ESOF.WebApp.DBLayer.Context;

public partial class ApplicationDbContext
{
    private void BuildFriendship(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Friendship>()
            .HasKey(f => f.FriendshipId);

        modelBuilder.Entity<Friendship>()
            .Property(f => f.CreatedAt)
            .IsRequired();

        modelBuilder.Entity<Friendship>()
            .Property(f => f.Status)
            .IsRequired()
            .HasDefaultValue(FriendshipStatus.Pending);

        modelBuilder.Entity<Friendship>()
            .Property(f => f.FriendshipId)
            .HasDefaultValueSql("gen_random_uuid()");

        modelBuilder.Entity<Friendship>()
            .HasOne(f => f.User1)
            .WithMany(u => u.FriendshipsInitiated)
            .HasForeignKey(f => f.UserId1)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<Friendship>()
            .HasOne(f => f.User2)
            .WithMany(u => u.FriendshipsReceived)
            .HasForeignKey(f => f.UserId2)
            .OnDelete(DeleteBehavior.Restrict);
    }
}