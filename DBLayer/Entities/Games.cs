using System.ComponentModel.DataAnnotations;
namespace ESOF.WebApp.DBLayer.Entities;

public class Games
{
    [Key]
    public Guid game_id{ get; set; }
    
    [Required]
    public String name{ get; set; }
    
    [Required]
    public String concole{ get; set; }
}