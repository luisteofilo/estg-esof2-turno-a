using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ESOF.WebApp.DBLayer.Entities;

public class speedrunModerator
{
    [Key]
    public Guid moderatorID { get; set; }
    
    [Required]
    public Guid userID { get; set; }
    
    [ForeignKey("userID")]
    public User user { get; set; }
    
    [Required]
    public Guid gameID { get; set; }
    
    [ForeignKey("gameID")]
    public Game game { get; set; }
    
    [Required]
    public DateTime roleGivenDate { get; set; }
    
    public ICollection<speedrunRun> SpeedRuns { get; set; }
}