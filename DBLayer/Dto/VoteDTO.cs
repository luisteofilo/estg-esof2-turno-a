namespace ESOF.WebApp.DBLayer.Dto;

public class VoteDTO
{
    public Guid UserId { get; set; }
    public Guid GameId { get; set; }
    public DateTime VoteTime { get; set; }
}