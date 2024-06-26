namespace ESOF.WebApp.WebAPI.DtoClasses.Response;

public class ResponseVideoQuestDto
{
    public Guid videoquestid { get; set; }
    public Guid gameid { get; set; }
    public string game { get; set; }
    public string description { get; set; }
    public DateTime created_at { get; set; }
    public IEnumerable<Guid> video_ids { get; set; }
    public List<ResponseVideoDto> videos { get; set; }
}