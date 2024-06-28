namespace ESOF.WebApp.WebAPI.DtoClasses.Response;

public class ResponseVideoDto
{
    public Guid videoid { get; set; }
    public Guid userid { get; set; }
    public string username { get; set; }
    public Guid videoquestid { get; set; }
    public string description { get; set; }
    public string videopath { get; set; }
    public string caption { get; set; }
    public int viewcount { get; set; }
    
    public DateTime created_at{ get; set; } 
    public IEnumerable<Guid> like_ids { get; set; }
    public IEnumerable<Guid> comment_ids { get; set; }
    public List<ResponseLikeDto> likes { get; set; }
    public List<ResponseCommentDto> comments { get; set; }
}