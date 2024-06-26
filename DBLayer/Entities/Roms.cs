using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Reflection.Metadata;

namespace ESOF.WebApp.DBLayer.Entities;

public class Roms
{
    [Key]
    public Guid RomId { get; set; }

    [ForeignKey("Game")]
    public Guid GameId { get; set; }

    [Required]
    public string ROM { get; set; }

    [Required]
    public string File_name { get; set; }

    public Games Game { get; set; }

    public ICollection<SaveStates> SaveStates { get; set;}
}