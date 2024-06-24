using System.ComponentModel.DataAnnotations;

namespace ESOF.WebApp.DBLayer.Entities;

public class TeamCompetition
{
    [Key]
    public Guid TeamCompetitionId { get; set; }

    public Guid TeamId { get; set; }
    public Team Team { get; set; }

    public Guid CompetitionId { get; set; }
    public Competition Competition { get; set; }
}