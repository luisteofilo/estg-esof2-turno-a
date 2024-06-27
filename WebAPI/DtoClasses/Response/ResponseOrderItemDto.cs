namespace ESOF.WebApp.WebAPI.DtoClasses.Response;

public class ResponseOrderItemDto{
	public Guid order_id{ get; set; }
	public Guid game_id{ get; set; }
	public int amount{ get; set; }
	
	public ResponseOrderDto order{ get; set; }
	public ResponseMKP_GameDto game{ get; set; }
}