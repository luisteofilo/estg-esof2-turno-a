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
    
    public User User { get; set; }
    
    public Game Game { get; set; }
    
    
}