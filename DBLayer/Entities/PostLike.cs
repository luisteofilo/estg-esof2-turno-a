using System.ComponentModel.DataAnnotations;

namespace ESOF.WebApp.DBLayer.Entities;

public class PostLike
{
    public Guid PostId { get; set; }
    
    public Guid UserId { get; set; }
    
    public Post Post { get; set; }
    public User User { get; set; }
}