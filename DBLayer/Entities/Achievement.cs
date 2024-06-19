using System.ComponentModel.DataAnnotations;

namespace ESOF.WebApp.DBLayer.Entities;

public class Achievement
{
    [Key]
    public int IdAchievement { get; set; }

    [Required]
    public string Name { get; set; }
    [Required]
    public string Description { get; set; }
    [Required]
    public int RequiredScore { get; set; }
    
    public ICollection<User> PlayerAchivements { get; set; }
}