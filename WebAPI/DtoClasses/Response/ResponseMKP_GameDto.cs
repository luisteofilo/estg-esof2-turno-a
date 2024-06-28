namespace ESOF.WebApp.WebAPI.DtoClasses.Response;

public class ResponseMKP_GameDto{
	public Guid id{ get; set; }
	public String name{ get; set; }
	public String description{ get; set; }
	public DateTimeOffset release_date{ get; set; }
	public float price{ get; set; }
	public int stock{ get; set; }
	
	public IEnumerable<Guid> genre_ids{ get; set; }
	public IEnumerable<Guid> platform_ids{ get; set; }
	public IEnumerable<Guid> order_ids{ get; set; }
	public IEnumerable<Guid> review_ids{ get; set; }
	
	//Full Data
	public List<ResponseGenreDto> genres{ get; set; }
	public List<ResponsePlatformDto> platforms{ get; set; }
	public List<ResponseOrderReviewDto> reviews{ get; set; }
	public List<ResponseOrderItemDto> orders{ get; set; }
	
}