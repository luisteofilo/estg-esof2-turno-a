using ESOF.WebApp.DBLayer.Entities;
namespace ESOF.WebApp.DBLayer.Context;

public class AchievementService
{
    private readonly ApplicationDbContext _context;

    public AchievementService(ApplicationDbContext context)
    {
        _context = context;
    }

    public void CheckAndUnlockAchievements(double score, User player)
    {
        var achievements = _context.Achievements.ToList();
        foreach (var achievement in achievements)
        {
            if (score >= achievement.RequiredScore)
            {
                if (!_context.PlayerAchievements.Any(pa => pa.UserId == player.UserId && pa.AchievementId == achievement.IdAchievement))
                {
                    var playerAchievement = new PlayerAchievement {
                        UserId = player.UserId,
                        AchievementId = achievement.IdAchievement,
                        UnlockedAt = DateTime.Now
                    };

                    _context.PlayerAchievements.Add(playerAchievement);
                    _context.SaveChanges();
                }
            }
        }
    }
}