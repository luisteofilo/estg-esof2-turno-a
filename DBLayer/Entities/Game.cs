using System.ComponentModel.DataAnnotations;

namespace ESOF.WebApp.DBLayer.Entities;

// TODO: Implement entity for the Game table
public class Game
{
    [Key]
    public Guid GameId { get; set; }
        
    [Required]
    public string Name { get; set; }

    // If a game can be favorited by multiple users, you might need a collection property for that
    public ICollection<Favourite> Favourites { get; set; }
}