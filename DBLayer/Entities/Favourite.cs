using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ESOF.WebApp.DBLayer.Entities;

public class Favourite
{
    [Key, Column(Order = 0)]
    public Guid UserId { get; set; }

    [Key, Column(Order = 1)]
    public Guid GameId { get; set; }

    // Navigation properties
    public User User { get; set; }
    public Game Game { get; set; }
}
