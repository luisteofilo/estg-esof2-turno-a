using ESOF.WebApp.DBLayer.Entities;
using Microsoft.EntityFrameworkCore;

namespace ESOF.WebApp.DBLayer.Context;

public partial class ApplicationDbContext
{
    private void BuildPlayerAchievements(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<PlayerAchievement>()
            .HasKey(p => new { p.UserId , p.AchievementId });

    }
}
