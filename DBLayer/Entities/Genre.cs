using System.ComponentModel.DataAnnotations;

namespace ESOF.WebApp.DBLayer.Entities;

public class Genre{
	[Key]
	public Guid genre_id{ get; set; }
	
	[Required]
	public String name{ get; set; }
	
	[Required]
	public String description{ get; set; }
}