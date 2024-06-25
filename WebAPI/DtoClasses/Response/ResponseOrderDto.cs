namespace ESOF.WebApp.WebAPI.DtoClasses.Response;

public class ResponseOrderDto{
	public Guid order_id{ get; set; }
	public Guid user_id{ get; set; }
	public bool completed{ get; set; }
	public String order_type{ get; set; }
	public IEnumerable<Guid> game_ids{ get; set; }
	
	//Full Data
	public List<ResponseOrderItemDto> items{ get; set; }
	public List<ResponseOrderReviewDto> reviews{ get; set; }
}