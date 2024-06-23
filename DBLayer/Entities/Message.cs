namespace ESOF.WebApp.DBLayer.Entities;

public class Message
{
    public Guid MessageId { get; set; }
    public Guid SenderId { get; set; }
    public User Sender { get; set; }
    public Guid ReceiverId { get; set; }
    public User Receiver { get; set; }
    public DateTime Time { get; set; }
    public string Content { get; set; }
}
