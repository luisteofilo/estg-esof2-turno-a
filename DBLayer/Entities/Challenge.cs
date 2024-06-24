using System.ComponentModel.DataAnnotations;

namespace ESOF.WebApp.DBLayer.Entities;

public class Challenge
{
    [Key]
    public Guid ChallengeId { get; set; }

    [Required]
    public string Description { get; set; }

    public Guid CompetitionId { get; set; }
    public Competition Competition { get; set; }

    public bool IsCompleted { get; set; }
    public ICollection<UserChallenge> UserChallenges { get; set; }
}