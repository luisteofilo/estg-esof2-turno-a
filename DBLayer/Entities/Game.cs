using System.ComponentModel.DataAnnotations;

namespace ESOF.WebApp.DBLayer.Entities;

public class Game{
    [Key]
    public Guid GameId{ get; set; }
	
    [Required]
    public String Name{ get; set; }
	
    [Required]
    public String Description{ get; set; }
	
    public ICollection<Vote> Votes { get; set; }
}