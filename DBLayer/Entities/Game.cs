using System.ComponentModel.DataAnnotations;

using System.Runtime.InteropServices.JavaScript;

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
    
    public byte[] Rom { get; set; }

    [Required]
    public List<Genre> Genres { get; set; } = new List<Genre>(); 

    [Required]
    public List<Category> Categories { get; set; } = new List<Category>(); 

    [Required]
    public List<Consoles> Consoles { get; set; } = new List<Consoles>();

    public ICollection<Shops> Shops { get; set; }
    
    public ICollection<Vote> Votes { get; set; }

}


//guid-> dizer que é o id principal
