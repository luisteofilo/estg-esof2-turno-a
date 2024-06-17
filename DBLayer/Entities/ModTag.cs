using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ESOF.WebApp.DBLayer.Entities;

public class ModTag
{
    [Key]
    public Guid TagId { get; set; }  // Unique identifier for the tag

    [Required, StringLength(100)]
    public string Name { get; set; }  // Name of the tag, e.g., "Graphics", "UI", "Adventure"

    [StringLength(255)]
    public string Description { get; set; }  // Optional: A brief description of what this tag generally encompasses

    // Navigation properties
    public ICollection<Mod> Mods { get; set; }  // Collection of mods associated with this tag
}
