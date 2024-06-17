using System.ComponentModel.DataAnnotations;

namespace ESOF.WebApp.DBLayer.Entities;

public class Post
{
    [Key]
    public Guid PostId { get; set; }
    
    [Required]
    public string comment { get; set; }
    
    [Required]
    public string title { get; set; }
    
    public Guid UserId { get; set; } // Foreign key for User
    public Guid GameId { get; set; }
    
    public User User { get; set; }
    
    public Game Game { get; set; }
    
    public ICollection<Comment> Comment { get; set; }
   

   
    
}