namespace ESOF.WebApp.DBLayer.Entities;

public class Friendship
{
    public Guid FriendshipId { get; set; }
    public Guid UserId1 { get; set; }
    public Guid UserId2 { get; set; }
    public DateTime CreatedAt { get; set; }
    public FriendshipStatus Status { get; set; }
    public User User1 { get; set; }
    public User User2 { get; set; }
}

