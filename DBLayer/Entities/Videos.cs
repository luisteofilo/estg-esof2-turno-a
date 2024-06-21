using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ESOF.WebApp.DBLayer.Entities;

public class Videos
{
    [Key]
    public Guid video_id{ get; set; }
    
    [ForeignKey("challenge_id")]
    public Challenges challenge{ get; set; }
    
    [ForeignKey("user_id")]
    public User user{ get; set; }
    
    [Required]
    public String caption{ get; set; }
    
    public ICollection<Likes> likes { get; set; }
    
    public ICollection<Comments> comments { get; set; }
}