using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ESOF.WebApp.DBLayer.Context;
using ESOF.WebApp.DBLayer.Entities;

namespace ESOF.WebApp.WebAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class GameReportController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public GameReportController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet("order")]
        public async Task<ActionResult<IEnumerable<Game>>> GetOrderedGames(
            string orderBy = "name", 
            string? name = null, 
            string? genre = null, 
            string? platform = null, 
            DateTime? releaseDate = null)
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
                query = query.Where(g => g.ReleaseDate.Date == releaseDate.Value.Date);
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

            return await query.ToListAsync();
        }
    }
}
