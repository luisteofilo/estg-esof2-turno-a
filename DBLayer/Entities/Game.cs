using System.ComponentModel.DataAnnotations;

namespace ESOF.WebApp.DBLayer.Entities;

public class Game
{
        [Key]
        public Guid GameId { get; set; }
        
        [Required]
        public String name { get; set; }
        
        [Required]
        public DateTime releaseDate { get; set; }
        
        [Required]
        public String developer { get; set; }
        
        [Required]
        public String publisher { get; set; }
        
        [Required]
        public String description { get; set; }
        
        [Required]
        public float price { get; set; }
        
        public String os { get; set; }
        
        public String processor { get; set; }
        
        public String memory { get; set; }
        
        public String graphics { get; set; }
        
        public String network { get; set; }
        
        public String storage { get; set; }
        
        public String additionalNotes { get; set; }
        
        
        [Required]
        public List<Genre> genres { get; set; } = new List<Genre>(); 
        
        [Required]
        public List<Category> categories { get; set; } = new List<Category>(); 
        
        [Required]
        public List<Console> consoles { get; set; } = new List<Console>();
        
        
        public ICollection<Shops> Shops { get; set; }
}


//guid-> dizer que é o id principal