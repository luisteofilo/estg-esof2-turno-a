using System.ComponentModel.DataAnnotations;

namespace ESOF.WebApp.DBLayer.Entities;

public class PlayerAchievement
{
    public Guid UserId { get; set; }
    
    public Guid AchievementId { get; set; }
    
    public DateOnly Unlocked { get; set; }
    
    public User User { get; set; }
    public Achievement Achievement { get; set; }
}