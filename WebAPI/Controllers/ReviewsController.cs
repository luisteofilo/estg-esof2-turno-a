using ESOF.WebApp.DBLayer.Context;
using ESOF.WebApp.DBLayer.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ESOF.WebApp.WebAPI.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class ReviewsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public ReviewsController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public IActionResult GetReviews()
        {
            var reviews = _context.Reviews;
            return Ok(reviews);
        }

        [HttpGet("{gameId}")]
        public async Task<List<Review>> GetReviewsFromGame(string gameId)
        {
            var reviews = await _context.Reviews.Where(r => r.GameId.ToString() == gameId).ToListAsync();
            return reviews;
        }
        
    }
}