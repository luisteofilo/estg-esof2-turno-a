namespace ESOF.WebApp.WebAPI.DtoClasses;

public class CreateOrderItemDto{
	public Guid gameId{ get; set; }
	public Guid orderId{ get; set; }
	public int amount{ get; set; }
	public Guid userId{ get; set; }
}