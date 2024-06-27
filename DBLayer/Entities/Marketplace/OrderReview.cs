using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ESOF.WebApp.DBLayer.Entities.Marketplace;

public class OrderReview{
	[Key]
	public Guid order_id{ get; set; }
	[Key]
	public Guid reviewer_id{ get; set; }
	
	[ForeignKey("order_id")]
	public Order order{ get; set; }
	
	[ForeignKey("reviewer_id")]
	public User Reviewer{ get; set; }
	
	[Required]
	public int rating{ get; set; }
	
	public String review{ get; set; }
}