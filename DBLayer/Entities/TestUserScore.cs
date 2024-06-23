using System.ComponentModel.DataAnnotations;

namespace ESOF.WebApp.DBLayer.Entities;

public class TestUserScore
{
    [Key]
    public Guid ScoreId { get; set; }
    public Guid UserId { get; set; }
    
    [Required]
    public long Score { get; set; }
    
    public User User { get; set; }
    
}