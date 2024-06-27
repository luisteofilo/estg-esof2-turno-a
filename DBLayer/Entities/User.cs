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


    //Novo parametro 
    public ICollection<PlayerAchievement> PlayerAchievements { get; set; }
    


    
    public ICollection<GameReplay> UserGameReplays { get; set; }

    public User()
    {
        UserGameReplays = new List<GameReplay>();
    }

    public ICollection<Game> GamesDeveloped { get; set; }
    
}