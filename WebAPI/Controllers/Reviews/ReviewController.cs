using ESOF.WebApp.DBLayer.Context;
using ESOF.WebApp.DBLayer.Entities;
using ESOF.WebApp.WebAPI.Services;
using Microsoft.AspNetCore.Mvc;
using Helpers.Models.View;
using Helpers.Models.Creation;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ESOF.WebApp.WebAPI.Controllers.Reviews
{
    [Route("reviews")]
    [ApiController]
    public class ReviewController : ControllerBase
    {
        private readonly ReviewService _reviewService = new(new ApplicationDbContext());

        [HttpGet("games/{gameId:guid}/reviews")]
        public async Task<ActionResult> GetReviewsGame(Guid gameId)
        {
            IEnumerable<ReviewViewModel> reviews = await _reviewService.GetGameReviews(new ReviewViewModel { GameId = gameId });
            return Ok(reviews);
        }

        [HttpPost("create")]
        public async Task<IActionResult> PostReview(Guid gameId, [FromBody] CreateReviewModel model)
        {
            await _reviewService.AddReview(model);
            return Ok();
        }

        [HttpDelete("delete")]
        public async Task<IActionResult> DeleteReview(DeleteReviewModel model)
        {
                await _reviewService.DeleteReview(model);
                return Ok();
        }

        [HttpPut("edit")]
        public async Task<IActionResult> UpdateReview(UpdateReviewModel model)
        {
            await _reviewService.UpdateReview(model);
            return Ok();
        }
        
        [HttpPut("approve")]
        public async Task<IActionResult> ApproveReview(ApproveReviewModel model)
        {
            await _reviewService.ApproveReview(model);
            return Ok();
        }
    }
}
