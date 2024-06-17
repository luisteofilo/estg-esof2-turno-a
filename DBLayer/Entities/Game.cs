using System.ComponentModel.DataAnnotations;

namespace ESOF.WebApp.DBLayer.Entities;

public class Game
{
    [Key]
    public Guid GameId { get; set; }
    
    public string title { get; set; }
    
    public ICollection<Post> Post { get; set; }

}