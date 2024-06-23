using Microsoft.AspNetCore.Mvc;
using System;
using System.Linq;
using System.Threading.Tasks;
using ESOF.WebApp.DBLayer.Context;
using ESOF.WebApp.DBLayer.Entities;
using Microsoft.EntityFrameworkCore;

[Route("api/[controller]")]
[ApiController]
public class VoteController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public VoteController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpPost]
    public async Task<IActionResult> Vote([FromBody] Vote vote)
    {
        try
        {
            var existingVote = _context.Votes
                .FirstOrDefault(v => v.UserId == vote.UserId && v.VoteTime.Month == DateTime.Now.Month && v.VoteTime.Year == DateTime.Now.Year);

            if (existingVote != null)
            {
                return BadRequest("Já votou este mês.");
            }

            vote.VoteTime = DateTime.Now;
            _context.Votes.Add(vote);
            await _context.SaveChangesAsync();
            return Ok();
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Erro ao registar voto: {ex.Message}"); // Linha de debug
            return StatusCode(500, "Erro interno no servidor.");
        }
    }


    [HttpGet("GameOfTheMonth")]
    public async Task<ActionResult<Game>> GetGameOfTheMonth()
    {
        var gameOfTheMonth = await _context.Votes
            .Where(v => v.VoteTime.Month == DateTime.Now.Month && v.VoteTime.Year == DateTime.Now.Year)
            .GroupBy(v => v.GameId)
            .OrderByDescending(g => g.Count())
            .Select(g => g.Key)
            .FirstOrDefaultAsync();

        if (gameOfTheMonth == default)
        {
            return NotFound("Nenhum voto foi registado este mês.");
        }

        var game = await _context.Games.FindAsync(gameOfTheMonth);
        return Ok(game);
    }

    [HttpGet("HasVoted/{userId}")]
    public async Task<ActionResult<bool>> HasVoted(Guid userId)
    {
        var existingVote = await _context.Votes
            .AnyAsync(v => v.UserId == userId && v.VoteTime.Month == DateTime.Now.Month && v.VoteTime.Year == DateTime.Now.Year);

        return Ok(existingVote);
    }

    [HttpGet("Counts")]
    public async Task<ActionResult<Dictionary<Guid, int>>> GetVoteCounts()
    {
        var voteCounts = await _context.Votes
            .Where(v => v.VoteTime.Month == DateTime.Now.Month && v.VoteTime.Year == DateTime.Now.Year)
            .GroupBy(v => v.GameId)
            .Select(g => new { GameId = g.Key, Count = g.Count() })
            .ToDictionaryAsync(g => g.GameId, g => g.Count);

        return Ok(voteCounts);
    }
}
