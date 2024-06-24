using System.ComponentModel.DataAnnotations;

namespace ESOF.WebApp.DBLayer.Entities;

public class Competition
{
    [Key]
    public Guid CompetitionId { get; set; }

    [Required]
    public string Name { get; set; }

    public DateTime StartDate { get; set; }
    public DateTime EndDate { get; set; }

    public ICollection<TeamCompetition> TeamCompetitions { get; set; }
    public ICollection<CompetitionResult> CompetitionResults { get; set; }
    public ICollection<Challenge> Challenges { get; set; }
}