using System.ComponentModel.DataAnnotations;

namespace ESOF.WebApp.DBLayer.Entities;

public class Games
{
    [Key]
    public Guid GameID { get; set; }
    
    [Required]
    public string Name { get; set; }
    public ICollection<RolePermission> RolePermissions { get; set; }
}