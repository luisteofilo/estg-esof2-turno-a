namespace ESOF.WebApp.DBLayer.Entities;

public class Friend
{
    public int Id { get; set; }
    public Guid SenderId { get; set; }
    public User Sender { get; set; }
    public Guid ReceiverId { get; set; }
    public User Receiver { get; set; }
    public DateTime RequestDate { get; set; }
    
}