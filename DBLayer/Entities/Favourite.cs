using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ESOF.WebApp.DBLayer.Entities;

public class Favourite
{
    public Guid UserId { get; set; }
    public Guid GameId { get; set; }

    // Navigation properties
    public User User { get; set; }
    public Game Game { get; set; }
}
