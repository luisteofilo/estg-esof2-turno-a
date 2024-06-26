using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ESOF.WebApp.DBLayer.Entities;

public class SpeedrunCategory
{
    [Key]
    public Guid categoryID { get; set; }
    
    [Required]
    public Guid gameID { get; set; }
    
    [ForeignKey("gameID")]
    public Game Game { get; set; }
    
    [Required]
    public DateTimeOffset creationDate { get; set; }
    
    [Required]
    public string categoryName { get; set; }
    
    [Required]
    public string categoryDescription { get; set; }
    
    [Required]
    public string categoryRules { get; set; }
    
    public ICollection<SpeedrunRun> speedrunRuns { get; set; }
}