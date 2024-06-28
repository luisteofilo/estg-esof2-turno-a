using System.ComponentModel.DataAnnotations;
using ESOF.WebApp.DBLayer.Entities.Marketplace;

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
    
    public ICollection<Game> GamesDeveloped { get; set; }
    
    public ICollection<SpeedrunRun> speedrunRuns { get; set; }

    public ICollection<SpeedrunModerator> speedrunModerators { get; set; }
    public ICollection<Favorite> Favorites { get; set; }

    //Novo parametro 
    public ICollection<PlayerAchievement> PlayerAchievements { get; set; }
    
    public ICollection<TestUserScore> TestUserScores { get; set; }
    

    public ICollection<OrderReview> UserOrderReviews { get; set; }
    public ICollection<OrderItem> UserOrderItems { get; set; }
    public ICollection<GameReplay> UserGameReplays { get; set; }

    public User()
    {
        UserGameReplays = new List<GameReplay>();
    }
}