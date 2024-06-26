namespace ESOF.WebApp.WebAPI.DtoClasses.Create;

public class CreateCommentDto
{
    public Guid userid { get; set; }
    public Guid videoid { get; set; }
    public string comment { get; set; }
}