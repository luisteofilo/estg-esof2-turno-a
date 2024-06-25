using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ESOF.WebApp.DBLayer.Entities;

public class SpeedrunModerator
{
    [Key]
    public Guid moderatorID { get; set; }
    
    public Guid userID { get; set; }
    
    [ForeignKey("userID")]
    public User user { get; set; }
    
    public Guid gameID { get; set; }
    
    [ForeignKey("gameID")]
    public Game game { get; set; }
    
    [Required]
    public DateTime roleGivenDate { get; set; }
    
    public ICollection<SpeedrunRun> SpeedRuns { get; set; }
}