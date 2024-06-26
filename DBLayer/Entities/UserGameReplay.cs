using System.ComponentModel.DataAnnotations;
namespace ESOF.WebApp.DBLayer.Entities;

public class UserGameReplay
{
    [Key]
    public Guid Id { get; set; }
        
    [Required]
    public Guid UserId { get; set; } // Foreign key for User
        
    public User User { get; set; }
        
    public ICollection<GameReplay> GameReplays { get; set; }
        
    public UserGameReplay()
    {
        GameReplays = new List<GameReplay>();
    }
}