using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ESOF.WebApp.DBLayer.Entities;

public class VideoQuests
{
    [Key]
    public Guid VideoQuestId { get; set; }
        
    public Guid GameId { get; set; }
    public Game Game { get; set; }
        
    [Required]
    public string Description { get; set; }
        
    [Required]
    public DateTime CreatedAt { get; set; }
        
    public ICollection<Video> Videos { get; set; }
}