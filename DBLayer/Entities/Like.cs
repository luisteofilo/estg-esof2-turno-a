using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ESOF.WebApp.DBLayer.Entities;

public class Like
{
    public Guid UserId { get; set; }
    public User User { get; set; }
    
    public Guid VideoId { get; set; }
    public Video Video { get; set; }
    
    [Required]
    public DateTime created_at{ get; set; }
}