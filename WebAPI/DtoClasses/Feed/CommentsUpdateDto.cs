namespace ESOF.WebApp.WebAPI.DtoClasses;

public class CommentsUpdateDto
{
    public Guid? CommentId { get; set; }
    
    public string? text { get; set; }
    
    public Guid? UserId { get; set; }
    public Guid? PostId { get; set; }

}