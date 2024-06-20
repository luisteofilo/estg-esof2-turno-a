using System.ComponentModel.DataAnnotations;

namespace ESOF.WebApp.DBLayer.Entities;

public class Game
{
    [Key]
    public Guid GameId { get; set; }

    [Required]
    public String Name { get; set; }

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
    
    [Required]
    public byte[] Rom { get; set; }

    [Required]
    public List<Genre> Genres { get; set; } = new List<Genre>(); 

    [Required]
    public List<Category> Categories { get; set; } = new List<Category>(); 

    [Required]
    public List<Console> Consoles { get; set; } = new List<Console>();

    public ICollection<Shops> Shops { get; set; }
}


//guid-> dizer que é o id principal