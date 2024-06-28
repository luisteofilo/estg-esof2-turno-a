using Microsoft.AspNetCore.Mvc;
using System;
using System.Linq;
using System.Threading.Tasks;
using ESOF.WebApp.DBLayer.Context;
using ESOF.WebApp.DBLayer.Dto;
using ESOF.WebApp.DBLayer.Entities;
using Microsoft.EntityFrameworkCore;

[Route("api/[controller]")]
[ApiController]
public class VoteController : ControllerBase
{
    private readonly ApplicationDbContext _context;
    private readonly IVoteRepository _voteRepository;

    public VoteController(ApplicationDbContext context, IVoteRepository voteRepository)
    {
        _context = context;
        _voteRepository = voteRepository ?? throw new ArgumentNullException(nameof(voteRepository));
    }

    [HttpPost]
    public async Task<IActionResult> PostVote(VoteDTO voteDto)
    {
        if (voteDto == null)
        {
            return BadRequest("Invalid data.");
        }

        var vote = new Vote
        {
            UserId = voteDto.UserId,
            GameId = voteDto.GameId,
            VoteTime = voteDto.VoteTime
        };

        _context.Votes.Add(vote);
        await _context.SaveChangesAsync();

        return Ok();
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

            if (gameOfTheMonthId == Guid.Empty)
            {
                return NotFound("Nenhum voto foi registado este mês.");
            }

            var game = await _context.Games.FindAsync(gameOfTheMonthId);

            // Recuperar os votos para o jogo do mês
            var votes = await _context.Votes
                .Where(v => v.GameId == gameOfTheMonthId && v.VoteTime.Month == DateTime.Now.Month && v.VoteTime.Year == DateTime.Now.Year)
                .ToListAsync();

            // Associar a coleção de votos ao jogo
            game.Votes = votes;

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








