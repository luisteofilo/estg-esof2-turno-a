using System.ComponentModel.DataAnnotations;

namespace ESOF.WebApp.DBLayer.Entities;

public class Users
{
    [Key]
    public Guid user_id{ get; set; }
    
    [Required]
    public String name{ get; set; }
}