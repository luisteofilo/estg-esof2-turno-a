using System.ComponentModel.DataAnnotations;

namespace ESOF.WebApp.DBLayer.Entities;

public class UserChallenge
{
    [Key]
    public Guid UserChallengeId { get; set; }

    public Guid UserId { get; set; }
    public User User { get; set; }

    public Guid ChallengeId { get; set; }
    public Challenge Challenge { get; set; }

    public DateTime CompletedOn { get; set; }
    
    public int Score { get; set; }
}