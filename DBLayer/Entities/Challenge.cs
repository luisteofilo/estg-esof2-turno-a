using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ESOF.WebApp.DBLayer.Entities;

public class Challenge
{
    [Key]
    public Guid challenge_id{ get; set; }
    
    [ForeignKey("game_id")]
    public Game game{ get; set; }
    
    [Required]
    public String description{ get; set; }
    
    [Required]
    public DateTime created_at{ get; set; }
    
    public ICollection<Video> videos { get; set; }
    
}