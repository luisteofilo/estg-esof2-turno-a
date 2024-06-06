using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ESOF.WebApp.DBLayer.Entities;

public class Shops
{
    [Key]
    public Guid gameOfMonthId { get; set; }
    
    [Required]
    public DateTime date { get; set; }
    
    [Required]
    public Guid gameId { get; set; }
    
    [ForeignKey("gameId")]
    public Game Game { get; set; }
}