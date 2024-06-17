using System.ComponentModel.DataAnnotations;

namespace ESOF.WebApp.DBLayer.Entities;

public class Game{
	[Key]
	public Guid game_id{ get; set; }
	
	[Required]
	public String name{ get; set; }
	
	[Required]
	public String description{ get; set; }
	
	[Required]
	public DateTime release_date{ get; set; }
	
	[Required]
	public float price { get; set; }
	
	[Required]
	public int stock { get; set; }
	
}