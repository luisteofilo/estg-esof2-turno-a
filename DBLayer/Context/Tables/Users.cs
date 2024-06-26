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
        
        // relação com a tabela SpeedrunRun
        modelBuilder.Entity<User>()
            .HasMany(u => u.speedrunRuns)
            .WithOne(r => r.player)
            .HasForeignKey(r => r.playerID);
        
        // relação com a tabela SpeedrunModerator
        modelBuilder.Entity<User>()
            .HasMany(u => u.speedrunModerators)
            .WithOne(m => m.user)
            .HasForeignKey(m => m.userID);
        
        // relação com a tabela Game
        modelBuilder.Entity<User>()
            .HasMany(u => u.GamesDeveloped)
            .WithOne(g => g.Developer)
            .HasForeignKey(g => g.DeveloperID);
            
    }
}