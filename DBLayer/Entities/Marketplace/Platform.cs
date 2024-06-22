using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using ESOF.WebApp.DBLayer.Entities.Marketplace;

namespace ESOF.WebApp.DBLayer.Entities;

public class Platform{
	[Key]
	public Guid platform_id { get; set; }
	[Required]
	public String name { get; set; }
	[Required]
	public int debut_year { get; set; }
	
	public ICollection<GamePlatform> gamePlatform { get; set; }
	public Platform(){
		gamePlatform = new List<GamePlatform>();
	}
}
