using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ESOF.WebApp.DBLayer.Entities;

public class Challenges
{
    [Key]
    public Guid challende_id{ get; set; }
    
    [ForeignKey("game_id")]
    public Games game{ get; set; }
    
    [Required]
    public String description{ get; set; }
    
    [Required]
    public DateTime created_at{ get; set; }
    
    public ICollection<Videos> videos { get; set; }
    
}