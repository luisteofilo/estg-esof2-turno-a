using ESOF.WebApp.DBLayer.Entities;
using Microsoft.EntityFrameworkCore;

// ReSharper disable once CheckNamespace
namespace ESOF.WebApp.DBLayer.Context;

public partial class ApplicationDbContext
{
    private void BuildUsers(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<User>()
            .HasMany(u => u.UserRoles)
            .WithOne(ur => ur.User)
            .HasForeignKey(ur => ur.UserId);

        modelBuilder.Entity<User>()
            .HasIndex(u => u.Email)
            .IsUnique();
        
        modelBuilder.Entity<User>()
            .Property(p => p.UserId)
            .HasDefaultValueSql("gen_random_uuid()");

        // Relação entre User e Team (CreatedTeams)
        modelBuilder.Entity<User>()
            .HasMany(u => u.CreatedTeams)
            .WithOne(t => t.CreatedByUser)
            .HasForeignKey(t => t.CreatedByUserId);

        // Relação entre User e TeamMember
        modelBuilder.Entity<User>()
            .HasMany(u => u.TeamMembers)
            .WithOne(tm => tm.User)
            .HasForeignKey(tm => tm.UserId);

        // Relação entre User e UserChallenge
        modelBuilder.Entity<User>()
            .HasMany(u => u.UserChallenges)
            .WithOne(uc => uc.User)
            .HasForeignKey(uc => uc.UserId);
        
        // Relação entre User e CompetitionResult
        modelBuilder.Entity<User>()
            .HasMany(u => u.CompetitionResults)
            .WithOne(cr => cr.User)
            .HasForeignKey(cr => cr.UserId);
    }
}