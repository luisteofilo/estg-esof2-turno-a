using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ESOF.WebApp.DBLayer.Context;
using ESOF.WebApp.DBLayer.Entities;
using Microsoft.Extensions.Logging;

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
            string orderBy = "name",
            string? name = null,
            string? genre = null,
            string? platform = null,
            DateTime? releaseDate = null)
        {
            try
            {
                _logger.LogDebug("Fetching games with filters: orderBy={OrderBy}, name={Name}, genre={Genre}, platform={Platform}, releaseDate={ReleaseDate}",
                    orderBy, name, genre, platform, releaseDate);

                IQueryable<Game> query = _context.Games.AsQueryable();

                if (!string.IsNullOrEmpty(name))
                {
                    _logger.LogDebug("Applying name filter: {Name}", name);
                    query = query.Where(g => g.Name.Contains(name, StringComparison.OrdinalIgnoreCase));
                }

                if (!string.IsNullOrEmpty(genre))
                {
                    _logger.LogDebug("Applying genre filter: {Genre}", genre);
                    query = query.Where(g => g.Genre == genre);
                }

                if (!string.IsNullOrEmpty(platform))
                {
                    _logger.LogDebug("Applying platform filter: {Platform}", platform);
                    query = query.Where(g => g.Platform == platform);
                }

                if (releaseDate.HasValue)
                {
                    _logger.LogDebug("Applying release date filter: {ReleaseDate}", releaseDate);
                    query = query.Where(g => g.ReleaseDate.Date == releaseDate.Value.Date);
                }

                switch (orderBy.ToLower())
                {
                    case "name":
                        _logger.LogDebug("Ordering by name");
                        query = query.OrderBy(g => g.Name);
                        break;
                    case "genre":
                        _logger.LogDebug("Ordering by genre");
                        query = query.OrderBy(g => g.Genre);
                        break;
                    case "platform":
                        _logger.LogDebug("Ordering by platform");
                        query = query.OrderBy(g => g.Platform);
                        break;
                    case "releasedate":
                        _logger.LogDebug("Ordering by release date");
                        query = query.OrderBy(g => g.ReleaseDate);
                        break;
                    default:
                        _logger.LogDebug("Ordering by default (name)");
                        query = query.OrderBy(g => g.Name);
                        break;
                }

                var result = await query.ToListAsync();
                _logger.LogDebug("Fetched {Count} games", result.Count);
                return result;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error fetching games");
                return StatusCode(500, "Internal server error");
            }
        }
    }
}
