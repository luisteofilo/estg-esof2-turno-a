using ESOF.WebApp.DBLayer.Context;
using ESOF.WebApp.DBLayer.Entities;
using ESOF.WebApp.WebAPI.Services;
using global::Helpers.Models.View;
using global::Helpers.Models.Creation;
using Microsoft.AspNetCore.Mvc;

namespace ESOF.WebApp.WebAPI.Controllers.Reviews
{
    [Route("reviews/[controller]")]
    [ApiController]
    public class ReviewController : ControllerBase
    {
        private readonly ReviewService _reviewService = new(new ApplicationDbContext());
        
        [HttpGet("games/{gameId:guid}/reviews")]
        public async Task<ActionResult<IEnumerable<Review>>> GetReviewsGame(Guid gameId)
        {
            IEnumerable<Review> reviews = await _reviewService.GetGameReviews(new ReviewViewModel { GameId = gameId });
            return new ActionResult<IEnumerable<Review>>(reviews);
        }
    }
}