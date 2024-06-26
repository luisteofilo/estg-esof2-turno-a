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
<<<<<<< HEAD
    
    // Add this line
    public ICollection<Favorite> Favorites { get; set; }
=======
>>>>>>> parent of 59e745d (Grupo A18 - Games Crud (#27))
}