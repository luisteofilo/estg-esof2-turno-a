using System;
using System.ComponentModel.DataAnnotations;

namespace ESOF.WebApp.DBLayer.Entities
{
    public class Game
    {
        [Key]
        public Guid GameId { get; set; }

        [Required]
        public required string Name { get; set; }
        public required string Genre { get; set; }
        public required string Platform { get; set; }
        public DateTime ReleaseDate { get; set; }
    }
}
