namespace ESOF.WebApp.WebAPI.DtoClasses;

public class CreatePlatformDto{
	public int debut_year{ get; set; }
	public String name{ get; set; }
	//Relationships
	public ICollection<Guid> gameIds { get; set; }
}