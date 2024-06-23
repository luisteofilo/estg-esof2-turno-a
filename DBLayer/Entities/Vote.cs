using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ESOF.WebApp.DBLayer.Entities;

public class Vote
{
    [Key]
    public Guid VoteId { get; set; }
    
    [Required]
    public Guid UserId { get; set; }
    
    [ForeignKey(nameof(UserId))]
    public User User { get; set; }
    
    [Required]
    public Guid GameId { get; set; }
    
    [ForeignKey(nameof(GameId))]
    public Game Game { get; set; }
    
    [Required]
    public DateTime VoteTime { get; set; }
}