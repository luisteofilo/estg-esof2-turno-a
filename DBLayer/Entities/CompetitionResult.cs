using System.ComponentModel.DataAnnotations;

namespace ESOF.WebApp.DBLayer.Entities;

public class CompetitionResult
{
    [Key]
    public Guid Id { get; set; }
    
    public Guid UserId { get; set; }
    public User User { get; set; }
    
    public Guid CompetitionId { get; set; }
    public Competition Competition { get; set; }

    public int Position { get; set; }
    
    public int Score { get; set; }
}