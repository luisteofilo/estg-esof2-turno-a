using Microsoft.AspNetCore.Mvc;
using ESOF.WebApp.DBLayer.Entities;
using ESOF.WebApp.DBLayer.Context;
using ESOF.WebApp.WebAPI;
using Microsoft.EntityFrameworkCore;

[Route("api/[controller]")]
[ApiController]
public class GameController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public GameController(ApplicationDbContext context)
    {
        _context = context;
    }
    
    [HttpGet]
    public async Task<ActionResult> GetGames()
    {
        try
        {
            var games = await _context.Games.ToListAsync();
            var voteCounts = await _context.Votes
                .GroupBy(v => v.GameId)
                .Select(g => new { GameId = g.Key, Count = g.Count() })
                .ToDictionaryAsync(g => g.GameId, g => g.Count);

            var result = games.Select(game => new Dictionary<string, object>
            {
                { "GameId", game.GameId },
                { "Name", game.Name },
                { "Description", game.Description },
                { "VoteCount", voteCounts.ContainsKey(game.GameId) ? voteCounts[game.GameId] : 0 }
            }).ToList();

            return Ok(result);
        }
        catch (Exception ex)
        {
            // Log exception
            Console.WriteLine($"Erro ao procurar jogos: {ex.Message}");
            return StatusCode(500, "Erro interno no servidor.");
        }
    }


    [HttpGet("{id}")]
    public async Task<ActionResult<Game>> GetGame(Guid id)
    {
        try
        {
            var game = await _context.Games.FindAsync(id);

            if (game == null)
            {
                return NotFound();
            }

            return game;
        }
        catch (Exception ex)
        {
            // Log exception
            Console.WriteLine($"Erro ao procurar jogo: {ex.Message}");
            return StatusCode(500, "Erro interno no servidor.");
        }
    }

}