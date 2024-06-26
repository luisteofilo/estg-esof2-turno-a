﻿using ESOF.WebApp.DBLayer.Context;
using ESOF.WebApp.DBLayer.Entities;
using Helpers.Models.Creation;
using Helpers.Models.View;
using Microsoft.EntityFrameworkCore;

namespace ESOF.WebApp.WebAPI.Services;

public class ReviewService(ApplicationDbContext db)
{
    public async void AddReview(CreateReviewModel model)
    {
        var game = db.Games.FirstOrDefault(g => g.GameId == model.GameId);
        if (game == null)
        {
            throw new Exception("Selected game does not exist");
        }

        game.Reviews.Add(new Review()
        {
            WrittenReview = model.WrittenReview,
            GameId = model.GameId,
            UserId = model.UserId,
            ReviewId = model.ReviewId,
            Rating = model.Rating,
            CreationDate = DateTime.Now,
            ApprovedStatus = false
        });

        await db.SaveChangesAsync();
    }

    public async void UpdateReview(UpdateReviewModel model)
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
        review.EditedDate = DateTime.Now;

        await db.SaveChangesAsync();
    }

    public async void ApproveReview(UpdateReviewModel model)
    {
        var review = db.Reviews.FirstOrDefault(r => r.ReviewId == model.ReviewId);
        if (review == null)
        {
            throw new Exception("Selected review does not exist");
        }

        review.ApprovedStatus = true;

        await db.SaveChangesAsync();
    }

    public async void DeleteReview(UpdateReviewModel model)
    {
        var review = db.Reviews.FirstOrDefault(r => r.ReviewId == model.ReviewId);
        if (review == null)
        {
            throw new Exception("Selected review does not exist");
        }

        db.Reviews.Remove(review);

        await db.SaveChangesAsync();
    }
    
    public async Task<IEnumerable<Review>> GetGameReviews(ReviewViewModel model)
    {
        var reviews = db.Reviews.Where(g => g.GameId == model.GameId);
        if (!reviews.Any())
        {
            throw new Exception("This game does not have reviews");
        }

        return reviews.ToList();
    }
    
    public async Task<IEnumerable<Review>> GetUserReviews(ReviewViewModel model)
    {
        var reviews = db.Reviews.Where(r => r.UserId == model.UserId);
        if (!reviews.Any())
        {
            throw new Exception("This user does not have reviews");
        }

        return reviews.ToList();
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
