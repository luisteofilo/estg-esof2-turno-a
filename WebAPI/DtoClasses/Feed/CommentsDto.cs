namespace ESOF.WebApp.WebAPI.DtoClasses;

public class CommentsDto
{
    public Guid? CommentId { get; set; }
    
    public string text { get; set; }
    
    public Guid UserId { get; set; }
    public Guid PostId { get; set; }

}