using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace ESOF.WebApp.DBLayer.Entities;

public class Review
{
    [Key]
    public Guid ReviewId { get; set; }

    [Required]
    public Guid UserId { get; set; }

    [Required]
    public Guid GameId { get; set; }

    [Required]
    [Range(0, 10)]
    public int Rating { get; set; }

    [Required]
    [MaxLength(1000)]
    public string WrittenReview { get; set; }

    public bool ApprovedStatus { get; set; } = false;

    public bool EditedStatus { get; set; } = false;

    public DateTime? EditedDate { get; set; }

    public DateTime CreationDate { get; set; } = DateTime.Now;
    
    [ForeignKey(nameof(UserId))]
    public User User { get; set; }
    
    [ForeignKey(nameof(GameId))]
    public Game Game { get; set; }
        
}
