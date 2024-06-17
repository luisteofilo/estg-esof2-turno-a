using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using ESOF.WebApp.DBLayer.Helpers;

namespace ESOF.WebApp.DBLayer.Entities;

public class OrderItem{
	[Key]
	public Guid game_id{ get; set; }
	
	[ForeignKey("game_id")]
	public Game game{ get; set; }
	
	[Key]
	public Guid user_id{ get; set; }
	
	[ForeignKey("user_id")]
	public User user{ get; set; }
	
	[Required]
	public int amount{ get; set; }
	

}