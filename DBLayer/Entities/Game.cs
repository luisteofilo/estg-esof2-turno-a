using System.ComponentModel.DataAnnotations;

namespace ESOF.WebApp.DBLayer.Entities;

public class Game
{
    [Key]
    public Guid GameId { get; set; }

    [Required]
    public String Title { get; set; }

    public ICollection<Review> Reviews { get; set; }
}
