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
        var today = DateTime.Now;
        var lastDayOfMonth = new DateTime(today.Year, today.Month, DateTime.DaysInMonth(today.Year, today.Month));
        var firstVotingDay = lastDayOfMonth.AddDays(-4);

        if (today < firstVotingDay)
        {
            return BadRequest("A votação só está disponível nos últimos 5 dias do mês.");
        }

        try
        {
            var existingVote = await _context.Votes
                .FirstOrDefaultAsync(v => v.UserId == vote.UserId && 
                                          v.VoteTime.Month == today.Month && 
                                          v.VoteTime.Year == today.Year);

            if (existingVote != null)
            {
                return BadRequest("Você já votou este mês.");
            }

            vote.VoteTime = today;
            _context.Votes.Add(vote);
            await _context.SaveChangesAsync();

            return Ok();
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Erro ao registrar voto: {ex.Message}");
            return StatusCode(500, "Erro interno no servidor.");
        }
    }
    
    [HttpGet("GameOfTheMonth")]
    public async Task<ActionResult<Game>> GetGameOfTheMonth()
    {
        try
        {
            var gameOfTheMonthId = await _context.Votes
                .Where(v => v.VoteTime.Month == DateTime.Now.Month && v.VoteTime.Year == DateTime.Now.Year)
                .GroupBy(v => v.GameId)
                .OrderByDescending(g => g.Count())
                .Select(g => g.Key)
                .FirstOrDefaultAsync();

            if (gameOfTheMonthId == default)
            {
                return NotFound("Nenhum voto foi registado este mês.");
            }

            var game = await _context.Games.FindAsync(gameOfTheMonthId);
            return Ok(game);
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Erro ao procurar jogo do mês: {ex.Message}");
            return StatusCode(500, "Erro interno no servidor.");
        }
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





