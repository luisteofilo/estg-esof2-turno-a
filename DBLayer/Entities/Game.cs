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
        public DateTime ReleaseDate { get; set; }
    
        [Required]
        public String Url_Image { get; set; }
    
        [Required]
        public String Developer { get; set; }

        [Required]
        public String Publisher { get; set; }

        [Required]
        public String Description { get; set; }

        [Required]
        public double Price { get; set; }
        
        public byte[] Rom { get; set; }
        
        [Required]
        public List<Genre> Genres { get; set; } = new List<Genre>(); 
        
        [Required]
        public List<Category> Categories { get; set; } = new List<Category>();
        
        [Required]
        public List<Consoles> Consoles { get; set; } = new List<Consoles>();

        // Navigation properties
        public ICollection<Favorite> Favorites { get; set; }
        
        public ICollection<Shops> Shops { get; set; }
    }
}