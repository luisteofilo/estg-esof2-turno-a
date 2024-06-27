namespace ESOF.WebApp.WebAPI.DtoClasses.Response;

public class ResponseGenreDto{
	public Guid id{ get; set; }
	public String name{ get; set; }
	public String description{ get; set; }
	public IEnumerable<Guid> game_ids{ get; set; }
	
	//Full Data
	public List<ResponseMKP_GameDto> games{ get; set; }
	
	
}