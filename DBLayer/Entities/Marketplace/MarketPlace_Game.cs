using System.ComponentModel.DataAnnotations;

namespace ESOF.WebApp.DBLayer.Entities.Marketplace;

public class MarketPlace_Game{
	[Key]
	public Guid game_id{ get; set; }
	
	[Required]
	public String name{ get; set; }
	
	[Required]
	public String description{ get; set; }
	
	[Required]
	public DateTimeOffset release_date{ get; set; }
	
	[Required]
	public float price { get; set; }
	
	[Required]
	public int stock { get; set; }
	
	public ICollection<GameGenre> gameGenres { get; set; }
	
	public ICollection<GamePlatform> gamePlatforms { get; set; }
	
	public ICollection<OrderItem> orderItems { get; set; }

	public MarketPlace_Game() {
		gameGenres = new List<GameGenre>();
		gamePlatforms = new List<GamePlatform>();
		orderItems = new List<OrderItem>();
	}
}