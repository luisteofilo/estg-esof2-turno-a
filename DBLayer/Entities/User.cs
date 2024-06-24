using System.Collections;
using System.ComponentModel.DataAnnotations;

namespace ESOF.WebApp.DBLayer.Entities;

public class User
{
    [Key]
    public Guid UserId { get; set; }
    
    [EmailAddress, Required]
    public string Email { get; set; }
    
    [Required]
    public byte[] PasswordHash { get; set; }
    
    [Required]
    public byte[] PasswordSalt { get; set; }
    public ICollection<UserRole> UserRoles { get; set; }
    
    // Relação com Teams criados pelo usuário
    public ICollection<Team> CreatedTeams { get; set; }
    
    // Relação com TeamMembers onde o usuário participa de equipes
    public ICollection<TeamMember> TeamMembers { get; set; }

    // Relação com UserChallenges onde o usuário completa desafios
    public ICollection<UserChallenge> UserChallenges { get; set; }
    
    public ICollection<CompetitionResult> CompetitionResults { get; set; }
    
}