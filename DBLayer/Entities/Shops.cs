using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ESOF.WebApp.DBLayer.Entities;

public class Shops
{
    
    [Key]
    public Guid ShopId { get; set; }
    public Guid GameOfMonthId { get; set; }
    
    [Required]
    public DateTime Date { get; set; }
    
    [Required]
    public Guid GameId { get; set; }
    
    [ForeignKey("gameId")]
    public Game Game { get; set; }
}