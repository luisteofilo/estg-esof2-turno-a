using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace ESOF.WebApp.DBLayer.Entities
{
    public class ModTag
    {
        [Key]
        public Guid TagId { get; set; } = Guid.NewGuid();  // Unique identifier for the tag

        [Required(ErrorMessage = "The Name field is required.")]
        [StringLength(255)]
        public string Name { get; set; } = string.Empty;  // Name of the tag

        [Required(ErrorMessage = "The Description field is required.")]
        [StringLength(4000)]
        public string Description { get; set; } = string.Empty;  // Description of the tag

        public ICollection<Mod> Mods { get; set; } = new List<Mod>();  // Collection of ModModTag for categorizing the tag
    }
}