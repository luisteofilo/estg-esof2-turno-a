namespace ESOF.WebApp.WebAPI.DtoClasses;

public class CreateOrderDto{
	public Guid user_id { get; set; }
	public bool completed{ get; set; }
	public String order_type{ get; set; }
	
	//Relationships
	public ICollection<Guid> orderItemIds { get; set; }
}