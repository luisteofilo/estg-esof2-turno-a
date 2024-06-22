namespace ESOF.WebApp.WebAPI.DtoClasses.Response;

public class ResponseOrderReviewDto{
	public Guid review_id{ get; set; }
	public Guid game_id{ get; set; }
	public Guid reviewer_id{ get; set; }
	public int rating{ get; set; }
	public String review{ get; set; }
	
	public ResponseMKP_GameDto game{ get; set; }
	
}