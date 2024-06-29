namespace Helpers.Models.View;

public class ReviewViewModel
{
    public Guid ReviewId { get; set; }
    public Guid UserId { get; set; }
    public Guid GameId { get; set; }
    public string Username { get; set; }
    public int Rating { get; set; }
    public string WrittenReview { get; set; }
    public DateTime CreationDate { get; set; }
    public bool ApprovedStatus { get; set; }
    public bool EditedStatus { get; set; }
    public DateTime? EditedDate { get; set; }
}