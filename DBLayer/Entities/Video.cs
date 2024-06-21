using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ESOF.WebApp.DBLayer.Entities;

public class Video
{
    [Key]
    public Guid video_id{ get; set; }
    
    [ForeignKey("challenge_id")]
    public Challenge challenge{ get; set; }
    
    [ForeignKey("user_id")]
    public User user{ get; set; }
    
    [Required]
    public String caption{ get; set; }
    
    public ICollection<Like> likes { get; set; }
    
    public ICollection<Comment> comments { get; set; }
}