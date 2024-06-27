using System.ComponentModel.DataAnnotations;

namespace ESOF.WebApp.DBLayer.Entities.Marketplace;

public class Genre{
	[Key]
	public Guid genre_id{ get; set; }
	
	[Required]
	public String name{ get; set; }
	
	[Required]
	public String description{ get; set; }
	
	public ICollection<GameGenre> gameGenres { get; set; }

	public Genre(){
		gameGenres = new List<GameGenre>();
	}
}