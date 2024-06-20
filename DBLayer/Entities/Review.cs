using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

// ReSharper disable once CheckNamespace
namespace ESOF.WebApp.DBLayer.Entities;

public class Review
{
    [Key]
    public Guid ReviewId { get; set; }
    
    public string Comment { get; set; }
    
    [Required]
    public int Evaluation { get; set; }
    
    
    [Required]
    public Guid UserId { get; set; }
    
    [ForeignKey(nameof(UserId))]
    public User User { get; set; }
    
    
    [Required]
    public Guid GameId { get; set; }
    
    [ForeignKey(nameof(GameId))]
    public Game Game { get; set; }
}