using System.ComponentModel.DataAnnotations;

namespace ESOF.WebApp.DBLayer.Entities;

public class CommentLike
{
    public Guid CommentId { get; set; }
    
    public Guid UserId { get; set; }
    
    public Comment Comment { get; set; }
    public User User { get; set; }
}