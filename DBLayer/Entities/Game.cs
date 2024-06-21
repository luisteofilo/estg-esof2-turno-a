using System.ComponentModel.DataAnnotations;
namespace ESOF.WebApp.DBLayer.Entities;

public class Game
{
    [Key]
    public Guid game_id{ get; set; }
    
    [Required]
    public String name{ get; set; }
    
    [Required]
    public String console{ get; set; }
    
    public ICollection<Challenge> challenges { get; set; }
}