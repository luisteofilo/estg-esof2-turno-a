using System.ComponentModel.DataAnnotations;

namespace ESOF.WebApp.DBLayer.Entities;

public class TestUserScore
{
    public Guid UserId { get; set; }
    
    public long Score { get; set; }
    
    public User User { get; set; }
}