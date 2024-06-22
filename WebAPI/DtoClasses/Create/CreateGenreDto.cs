namespace ESOF.WebApp.WebAPI.DtoClasses;

public class CreateGenreDto{
	public String name{ get; set; }
	public String description{ get; set; }
	
	//Relationships
	public ICollection<Guid> gameIds { get; set; }
	
}