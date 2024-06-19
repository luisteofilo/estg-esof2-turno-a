using ESOF.WebApp.DBLayer.Entities;
using Microsoft.EntityFrameworkCore;

namespace ESOF.WebApp.DBLayer.Context;

public partial class ApplicationDbContext
{
    public void BuildPlayerAchievements(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<PlayerAchievement>()
            .HasOne(pa => pa.User)
            .WithMany(p => p.PlayerAchievements)
            .HasForeignKey(pa => pa.UserId);

        modelBuilder.Entity<PlayerAchievement>()
            .HasOne(pa => pa.Achievement)
            .WithMany(a => a.PlayerAchievements)
            .HasForeignKey(pa => pa.AchievementId);
    }
    
}
