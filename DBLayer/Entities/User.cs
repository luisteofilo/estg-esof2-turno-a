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
    //Novo parametro 
    public Achievement Achievement { get; set; }
    
=======
    
    //Parametro para achievements
>>>>>>> 156f5a44b941a5be34e63436643a5953da985e91
}