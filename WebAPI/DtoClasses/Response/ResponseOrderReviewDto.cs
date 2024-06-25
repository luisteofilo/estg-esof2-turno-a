namespace ESOF.WebApp.WebAPI.DtoClasses.Response;

public class ResponseOrderReviewDto{
	public Guid order_id{ get; set; }
	public Guid reviewer_id{ get; set; }
	public int rating{ get; set; }
	public String review{ get; set; }
	
	public ResponseMKP_GameDto game{ get; set; }
	
}