using System.ComponentModel.DataAnnotations;

namespace ESOF.WebApp.DBLayer.Entities;

public class TeamMember
{
    [Key]
    public Guid TeamMemberId { get; set; }

    public Guid TeamId { get; set; }
    public Team Team { get; set; }

    public Guid UserId { get; set; }
    public User User { get; set; }

    public DateTime JoinDate { get; set; }
}