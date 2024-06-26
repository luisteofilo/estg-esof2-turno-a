using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ESOF.WebApp.DBLayer.Entities.Marketplace;

public class GameGenre{
	[Key]
	public Guid game_id{ get; set; }
	
	[ForeignKey("game_id")]
	public MarketPlace_Game MarketPlaceGame{ get; set; }
	
	[Key]
	public Guid genre_id{ get; set; }
	
	[ForeignKey("genre_id")]
	public Genre genre{ get; set; }
}