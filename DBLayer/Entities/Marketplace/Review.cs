using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ESOF.WebApp.DBLayer.Entities.Marketplace;

public class Review{
	[Key]
	public Guid review_id{ get; set; }
	
	[Key]
	public Guid game_id{ get; set; }
	
	[ForeignKey("game_id")]
	public Game game{ get; set; }
	
	[Required]
	public int rating{ get; set; }
	
	public String review{ get; set; }
	

}