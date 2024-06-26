namespace ESOF.WebApp.WebAPI.DtoClasses.Create;

public class CreateLikeDto
{
    public Guid userid { get; set; }
    public Guid videoid { get; set; }
    public DateTime created_at { get; set; }
}