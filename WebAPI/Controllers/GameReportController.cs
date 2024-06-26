using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ESOF.WebApp.DBLayer.Context;
using ESOF.WebApp.DBLayer.Entities;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;
using System.Collections.Generic;

namespace ESOF.WebApp.WebAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class GameReportController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly ILogger<GameReportController> _logger;

        public GameReportController(ApplicationDbContext context, ILogger<GameReportController> logger)
        {
            _context = context;
            _logger = logger;
        }

        [HttpGet("order")]
        public async Task<ActionResult<IEnumerable<Game>>> GetOrderedGames(
            [FromQuery] string orderBy = "name",
            [FromQuery] string? name = null,
            [FromQuery] string? genre = null,
            [FromQuery] string? platform = null,
            [FromQuery] DateTime? releaseDate = null)
        {
            try
            {
                IQueryable<Game> query = _context.Games.AsQueryable();

                if (!string.IsNullOrEmpty(name))
                {
                    query = query.Where(g => g.Name.Contains(name));
                }

                if (!string.IsNullOrEmpty(genre))
                {
                    query = query.Where(g => g.Genre == genre);
                }

                if (!string.IsNullOrEmpty(platform))
                {
                    query = query.Where(g => g.Platform == platform);
                }

                if (releaseDate.HasValue)
                {
                    _logger.LogInformation("Release date provided: {ReleaseDate}", releaseDate.Value);
                    var releaseDateUtc = DateTime.SpecifyKind(releaseDate.Value, DateTimeKind.Utc);
                    _logger.LogInformation("Converted to UTC: {ReleaseDateUtc}", releaseDateUtc);
                    query = query.Where(g => g.ReleaseDate.Date == releaseDateUtc.Date);
                }

                switch (orderBy.ToLower())
                {
                    case "name":
                        query = query.OrderBy(g => g.Name);
                        break;
                    case "genre":
                        query = query.OrderBy(g => g.Genre);
                        break;
                    case "platform":
                        query = query.OrderBy(g => g.Platform);
                        break;
                    case "releasedate":
                        query = query.OrderBy(g => g.ReleaseDate);
                        break;
                    default:
                        query = query.OrderBy(g => g.Name);
                        break;
                }

                var games = await query.ToListAsync();

                if (games == null || !games.Any())
                {
                    _logger.LogInformation("No games found with the specified criteria");
                    return NotFound("No games found with the specified criteria");
                }

                _logger.LogInformation("Returning {Count} games", games.Count);

                return Ok(games);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while getting ordered games");
                return StatusCode(500, "An error occurred while processing your request.");
            }
        }

        [HttpGet("users/emails")]
        public async Task<ActionResult<IEnumerable<string>>> GetUsersEmails()
        {
            var emails = await _context.Users.Select(u => u.Email).ToListAsync();
            return Ok(emails);
        }

        [HttpGet("users")]
        public async Task<ActionResult<IEnumerable<User>>> GetUsers()
        {
            var users = await _context.Users.ToListAsync();
            return Ok(users);
        }

        [HttpGet("games")]
        public async Task<ActionResult<IEnumerable<Game>>> GetGames()
        {
            var games = await _context.Games.ToListAsync();
            return Ok(games);
        }
    }
}
