using ESOF.WebApp.DBLayer.Context;
using ESOF.WebApp.DBLayer.Entities;
using Helpers.Models.Creation;
using Helpers.Models.View;
using Microsoft.EntityFrameworkCore;

namespace ESOF.WebApp.WebAPI.Services;

public class ReviewService(ApplicationDbContext db)
{
    public async Task AddReview(CreateReviewModel model)
    {
        var game = db.Games.FirstOrDefault(g => g.GameId == model.GameId);
        if (game == null)
        {
            throw new Exception("Selected game does not exist");
        }
        
        if (game.Reviews == null)
        {
            game.Reviews = new List<Review>();
        }
        
        var review = new Review
        {
            WrittenReview = model.WrittenReview,
            GameId = model.GameId,
            UserId = model.UserId,
            Rating = model.Rating,
            ApprovedStatus = false,
            EditedStatus = false,
            CreationDate = DateTime.UtcNow
        };
        
        if (db == null)

        {

            throw new Exception("Database context is null");

        }


        if (game.Reviews == null)

        {

            throw new Exception("Game.Reviews is null");

        }
        game.Reviews.Add(review);
    
        
        
        await db.SaveChangesAsync();
    }

    public async Task UpdateReview(UpdateReviewModel model)
    {
        var review = db.Reviews.FirstOrDefault(r => r.ReviewId == model.ReviewId);
        if (review == null)
        {
            throw new Exception("Selected review does not exist");
        }

        review.WrittenReview = model.WrittenReview;
        review.Rating = model.Rating;
        review.ApprovedStatus = false;
        review.EditedStatus = true;
        review.EditedDate = DateTime.UtcNow;

        await db.SaveChangesAsync();
    }

    public async Task ApproveReview(ApproveReviewModel model)
    {
        var review = db.Reviews.FirstOrDefault(r => r.ReviewId == model.ReviewId);
        if (review == null)
        {
            throw new Exception("Selected review does not exist");
        }

        review.ApprovedStatus = true;

        await db.SaveChangesAsync();
    }

    public async Task DeleteReview(DeleteReviewModel model)
    {
        var review = db.Reviews.FirstOrDefault(r => r.ReviewId == model.ReviewId);
        if (review == null)
        {
            throw new Exception("Selected review does not exist");
        }

        db.Reviews.Remove(review);

        await db.SaveChangesAsync();
    }
    
    public async Task<IEnumerable<ReviewViewModel>> GetGameReviews(ReviewViewModel model)
    {
        var reviews = await db.Reviews
            .Where(g => g.GameId == model.GameId)
            .Include(r => r.User) // Include the related User entity
            .Select(r => new ReviewViewModel
            {
                ReviewId = r.ReviewId,
                GameId = r.GameId,
                UserId = r.UserId,
                Username = r.User.Username, 
                Rating = r.Rating,
                WrittenReview = r.WrittenReview,
                CreationDate = r.CreationDate,
                EditedDate = r.EditedDate,
                EditedStatus = r.EditedStatus,
                ApprovedStatus = r.ApprovedStatus
            })
            .ToListAsync();

        return reviews;
    }

    public async Task<Review> GetReviewById(ReviewViewModel model)
    {
        var review = db.Reviews.FirstOrDefault(r => r.ReviewId == model.ReviewId);
        if (review == null)
        {
            throw new Exception($"Review with ID {model.ReviewId} not found");
        }
        return review;
    }
}
