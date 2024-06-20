using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using ESOF.WebApp.DBLayer.Helpers;

namespace ESOF.WebApp.DBLayer.Entities.Marketplace;

public class Order{
	[Key]
	public Guid order_id{ get; set; }
	
	[Key]
	public Guid user_id{ get; set; }
	
	[ForeignKey("user_id")]
	public User user{ get; set; }
	
	[Required]
	public bool completed{ get; set; }
	
	[Required]
	[OrderTypeValidator]
	public String order_type{ get; set; }
	
	public ICollection<OrderItem> orderItems { get; set; }


	
}