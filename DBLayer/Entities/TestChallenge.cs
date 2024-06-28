using System.ComponentModel.DataAnnotations;

namespace ESOF.WebApp.DBLayer.Entities;

public class TestChallenge
{
    [Key]
    public Guid IdTestChallenge { get; set; }

    [Required]
    public string Name { get; set; }
    [Required]
    public string Description { get; set; }
    
    public ICollection<TestChallengeUser> TestChallengeUsers { get; set; }
}