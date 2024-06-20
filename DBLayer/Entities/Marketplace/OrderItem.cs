using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using ESOF.WebApp.DBLayer.Helpers;

namespace ESOF.WebApp.DBLayer.Entities.Marketplace;

public class OrderItem{
	[Key]
	public Guid game_id{ get; set; }
	
	[ForeignKey("game_id")]
	public Game game{ get; set; }
	
	[Key]
	public Guid order_id{ get; set; }
	
	[ForeignKey("order_id")]
	public Order order{ get; set; }
	
	[Required]
	public int amount{ get; set; }
	

}