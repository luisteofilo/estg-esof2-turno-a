using System.ComponentModel.DataAnnotations;

namespace ESOF.WebApp.DBLayer.Entities;

public class Achievement
{
    [Key]
    public Guid IdAchievement { get; set; }

    [Required]
    public string Name { get; set; }
    [Required]
    public string Description { get; set; }
    [Required]
    public long RequiredScore { get; set; }
    
    public ICollection<PlayerAchievement> PlayerAchievements { get; set; }
    
}