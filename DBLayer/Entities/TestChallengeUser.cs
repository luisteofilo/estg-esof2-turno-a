using System.ComponentModel.DataAnnotations;

namespace ESOF.WebApp.DBLayer.Entities;

public class TestChallengeUser
{
    public Guid UserId { get; set; }
    
    public Guid TestChallengeId { get; set; }
    
    public long Score { get; set; }
    
    public User User { get; set; }
    public TestChallenge TestChallenge { get; set; }
}