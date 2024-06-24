using ESOF.WebApp.DBLayer.Entities;
using Microsoft.EntityFrameworkCore;

// ReSharper disable once CheckNamespace
namespace ESOF.WebApp.DBLayer.Context;

public partial class ApplicationDbContext
{
    private void BuildUserChallenge(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<UserChallenge>()
            .HasKey(uc => new { uc.UserId, uc.ChallengeId });
        
        modelBuilder.Entity<UserChallenge>()
            .HasOne(uc => uc.User)
            .WithMany(u => u.UserChallenges)
            .HasForeignKey(uc => uc.UserId);

        modelBuilder.Entity<UserChallenge>()
            .HasOne(uc => uc.Challenge)
            .WithMany(c => c.UserChallenges)
            .HasForeignKey(uc => uc.ChallengeId);
        
        modelBuilder.Entity<UserChallenge>()
            .Property(uc => uc.Score)
            .IsRequired();
    }
}