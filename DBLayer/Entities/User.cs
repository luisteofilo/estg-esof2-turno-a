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
    public ICollection<OrderReview> UserOrderReviews { get; set; }
    public ICollection<OrderItem> UserOrderItems { get; set; }
}