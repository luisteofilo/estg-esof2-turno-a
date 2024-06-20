using System.ComponentModel.DataAnnotations;

namespace ESOF.WebApp.DBLayer.Entities
{
    public class Game
    {
        [Key]
        public Guid GameId { get; set; }
        
        [Required]
        public string Name { get; set; }
        
        [Required]
        public string Genre { get; set; }
        
        [Required]
        public string Platform { get; set; }

        public ICollection<Favorite> Favorites { get; set; }
    }
}