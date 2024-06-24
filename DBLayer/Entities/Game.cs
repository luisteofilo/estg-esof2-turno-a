using System.ComponentModel.DataAnnotations;
namespace ESOF.WebApp.DBLayer.Entities;

public class Game
{
    [Key]
    public Guid GameId { get; set; }
        
    [Required]
    public string Name { get; set; }
        
    [Required]
    public string Console { get; set; }
        
    public ICollection<VideoQuests> Challenges { get; set; }
}