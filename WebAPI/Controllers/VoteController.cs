using Microsoft.AspNetCore.Mvc;
using System;
using System.Linq;
using System.Threading.Tasks;
using ESOF.WebApp.DBLayer.Context;
using ESOF.WebApp.DBLayer.Entities;
using ESOF.WebApp.WebAPI;
using Microsoft.EntityFrameworkCore;

[ApiController]
[Route("api/[controller]")]
public class VoteController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public VoteController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpPost]
    public async Task<IActionResult> PostVote([FromBody] Vote vote)
    {
        if (vote == null || vote.GameId == Guid.Empty || vote.UserId == Guid.Empty)
        {
            return BadRequest("Voto inválido.");
        }

        try
        {
            _context.Votes.Add(vote);
            await _context.SaveChangesAsync();
            return Ok("Voto registado com sucesso.");
        }
        catch (Exception ex)
        {
            // Log the exception details
            Console.WriteLine($"Erro ao registar voto: {ex.Message}");
            return StatusCode(500, "Erro interno ao registrar voto.");
        }
    }

    [HttpGet("HasVoted/{userId}")]
    public async Task<IActionResult> HasVoted(Guid userId)
    {
        var hasVoted = await _context.Votes.AnyAsync(v => v.UserId == userId && 
                                                          v.VoteTime.Month == DateTime.UtcNow.Month && v.VoteTime.Year == DateTime.UtcNow.Year);
        return Ok(hasVoted);
    }

    [HttpGet("Counts")]
    public async Task<IActionResult> GetVoteCounts()
    {
        var counts = await _context.Votes
            .Where(v => v.VoteTime.Month == DateTime.UtcNow.Month && v.VoteTime.Year == DateTime.UtcNow.Year)
            .GroupBy(v => v.GameId)
            .Select(g => new { GameId = g.Key, Count = g.Count() })
            .ToDictionaryAsync(g => g.GameId, g => g.Count);

        return Ok(counts);
    }
}






