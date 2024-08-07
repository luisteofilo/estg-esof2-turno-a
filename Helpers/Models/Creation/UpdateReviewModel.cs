﻿namespace Helpers.Models.Creation;

public class UpdateReviewModel
{
    public Guid ReviewId { get; set; }
    public Guid UserId { get; set; }
    public string WrittenReview { get; set; }
    public int Rating { get; set; }
    public DateTime EditedDate { get; }
}