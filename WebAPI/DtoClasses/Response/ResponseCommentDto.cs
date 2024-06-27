namespace ESOF.WebApp.WebAPI.DtoClasses.Response;

public class ResponseCommentDto
{
    public Guid userid { get; set; }
    public Guid videoid { get; set; }
    public string comment { get; set; }
    public DateTime created_at { get; set; }
}