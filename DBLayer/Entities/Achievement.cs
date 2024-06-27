using System.ComponentModel.DataAnnotations;

namespace ESOF.WebApp.DBLayer.Entities;

public class Achievement
{
    [Key]
    public int IdAchievement { get; set; }
    public Guid IdAchievement { get; set; }
    [Required]
    public string Name { get; set; }
    [Required]
    public string Description { get; set; }
    [Required]
    public int RequiredScore { get; set; }
    public ICollection<PlayerAchievement> PlayerAchievements { get; set; }
    //public User User { get; set; }
    //public Guid UserId { get; set; }
    public long RequiredScore { get; set; }
    
    public ICollection<PlayerAchievement> PlayerAchievements { get; set; }
    
}