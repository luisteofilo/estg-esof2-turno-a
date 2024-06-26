using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ESOF.WebApp.DBLayer.Entities.Marketplace;

public class GameGenre{
	[Key, Column(Order = 0)]
	public Guid game_id{ get; set; }
	
	[ForeignKey("game_id")]
	public MarketPlace_Game MarketPlaceGame{ get; set; }
	
	[Key, Column(Order = 1)]
	public Guid genre_id{ get; set; }
	
	[ForeignKey("genre_id")]
	public Genre genre{ get; set; }
}