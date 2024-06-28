using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Reflection.Metadata;

namespace ESOF.WebApp.DBLayer.Entities;

public class SaveStates
{
    [Key]
    public Guid SaveStateId { get; set; }

    [Required]
    [ForeignKey("Rom")]
    public Guid RomId { get; set; }

    [Required]
    public Guid UserId { get; set; }

    [Required]
    public DateTime Date { get; set; }

    public Roms Rom { get; set; } 
}