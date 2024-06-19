namespace ESOF.WebApp.DBLayer.Entities;

public class PlayerAchievement
{
    public int UserId { get; set; }
    public User User { get; set; }

    public int AchievementId { get; set; }
    public Achievement Achievement { get; set; }

    public DateTime UnlockedAt { get; set; }
}