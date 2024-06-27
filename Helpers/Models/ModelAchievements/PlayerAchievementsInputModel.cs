namespace Helpers.Models;

public class PlayerAchievementsInputModel
{
    protected Guid UserId { get; set; }
    protected Guid AchievementId { get; set; }
    public DateOnly Unlocked { get; set; }
}