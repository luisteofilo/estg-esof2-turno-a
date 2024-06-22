using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Reflection.Metadata;

namespace ESOF.WebApp.DBLayer.Entities;

public class Roms
{
    [Key]
    [ForeignKey("Game")]  
    public Guid GameId { get; set; }

    [Required]
    public Blob ROM { get; set; }
    
    [Required]
    public string File_name{ get; set; }

    public Games Game { get; set; }  
}