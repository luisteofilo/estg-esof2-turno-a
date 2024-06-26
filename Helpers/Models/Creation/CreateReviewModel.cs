namespace Helpers.Models.Creation;

public class CreateReviewModel
{
    public string WrittenReview { get; set; }
    public Guid GameId { get; set; }
    
    public Guid UserId { get; set; }
    
    public int Rating { get; set; }
}