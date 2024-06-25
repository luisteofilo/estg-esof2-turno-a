using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ESOF.WebApp.DBLayer.Entities;

public class Video
{
    [Key]
    public Guid VideoId{ get; set; }
    
    public Guid ChallengeId { get; set; }
    public VideoQuests VideoQuests{ get; set; }
    
    public Guid UserId { get; set; }
    public User User { get; set; }
    
    [Required]
    public String Caption{ get; set; }
    
    public int ViewCount { get; set; }
    
    public ICollection<Like> Likes { get; set; }
    public ICollection<Comment> Comments { get; set; }
}