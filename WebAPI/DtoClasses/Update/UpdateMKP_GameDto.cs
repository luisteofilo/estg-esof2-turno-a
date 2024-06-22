namespace ESOF.WebApp.WebAPI.DtoClasses.Update;

public class UpdateMKP_GameDto{
	public String? name	{ get; set; }
	public String? description	{ get; set; }
	public DateTimeOffset? release_date	{ get; set; }
	public float? price	{ get; set; } 
	public int? stock	{ get; set; }
	public ICollection<Guid>? gameGenres	{ get; set; }
	public ICollection<Guid>? gamePlatforms	{ get; set; }
	public ICollection<Guid>? gameReviews	{ get; set; }
	public ICollection<Guid>? orderItems	{ get; set; }
	
}