using System.ComponentModel.DataAnnotations;

namespace ESOF.WebApp.DBLayer.Entities;

public class Team
{
    [Key]
    public Guid TeamId { get; set; }

    [Required]
    public string Name { get; set; }

    public DateTime CreationDate { get; set; }

    public Guid CreatedByUserId { get; set; }
    public User CreatedByUser { get; set; }

    public ICollection<TeamMember> TeamMembers { get; set; }
    public ICollection<TeamCompetition> TeamCompetitions { get; set; }
}