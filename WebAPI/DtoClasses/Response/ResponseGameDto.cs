namespace ESOF.WebApp.WebAPI.DtoClasses.Response;

public class ResponseGameDto
{
    public Guid gameid { get; set; }
    public string name { get; set; }
    public string console { get; set; }
    public IEnumerable<Guid> challenge_ids { get; set; }
    public List<ResponseVideoQuestDto> challenges { get; set; }
}