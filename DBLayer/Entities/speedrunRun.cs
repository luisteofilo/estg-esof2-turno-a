using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ESOF.WebApp.DBLayer.Entities;

public class SpeedrunRun
{
    [Key]
    public Guid runID { get; set; }
    
    [Required]
    public Guid playerID { get; set; }
    
    [ForeignKey("playerID")]
    public User player { get; set; }
    
    [Required]
    public Guid categoryID { get; set; }
    
    [ForeignKey("categoryID")]
    public SpeedrunCategory category { get; set; }
    
    [Required]
    public int runTime { get; set; }
    
    [Required]
    public DateTime SubmissionDate { get; set; }
    
    [DefaultValue("false")]
    public bool verified { get; set; }
    
    public Guid? verifierID { get; set; }  
    
    [ForeignKey("verifierID")]
    public SpeedrunModerator verifier { get; set; }
    
    [Required]
    public string videoLink { get; set; }
}