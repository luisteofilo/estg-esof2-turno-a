using ESOF.WebApp.DBLayer.Context;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ESOF.WebApp.WebAPI.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class GameController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public GameController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public IActionResult GetGames()
        {
            var games = _context.Games;
            return Ok(games);
        }

        [HttpGet("{gameId}")]
        public async Task<IActionResult> GetGameName(string gameId)
        {
            var game = await _context.Games.FirstOrDefaultAsync(g => g.GameId.ToString() == gameId);
            if (game == null)
            {
                return NotFound();
            }

            return Ok(game);
        }
    }

}