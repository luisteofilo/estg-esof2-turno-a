namespace ESOF.WebApp.WebAPI.DtoClasses;

public class CreateMKP_GameDto{
	public String name{ get; set; }
	public String description{ get; set; }
	public DateTimeOffset release_date{ get; set; }
	public float price { get; set; }
	public int stock { get; set; }

	//Relationships
	public ICollection<Guid> genreIds { get; set; }
	public ICollection<Guid> platformIds { get; set; }
	public ICollection<Guid> reviewIds { get; set; }
	public ICollection<Guid> orderItemIds { get; set; }
}