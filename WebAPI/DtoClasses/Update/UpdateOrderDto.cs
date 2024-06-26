namespace ESOF.WebApp.WebAPI.DtoClasses.Update;

public class UpdateOrderDto{
	public Guid? user_id{ get; set; }
	public bool? completed{ get; set; }
	public String? order_type{ get; set; }
	public ICollection<Guid>? orderItems{ get; set; }
}