using System.ComponentModel.DataAnnotations;

namespace ESOF.WebApp.DBLayer.Entities;

public class Comment
{
    [Key]
    public Guid CommentId { get; set; }
    
    public string text { get; set; }
    
    public User User { get; set; }
    
    public Post Post { get; set; }
    
}