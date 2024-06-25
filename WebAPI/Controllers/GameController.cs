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
    private readonly IVoteRepository _voteRepository;

    public GameController(ApplicationDbContext context, IVoteRepository voteRepository)
    {
        _context = context;
        _voteRepository = voteRepository ?? throw new ArgumentNullException(nameof(voteRepository));
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
    
    [HttpPost]
    public async Task<IActionResult> PostVote([FromBody] Vote vote)
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
            // Lógica para verificar se o utilizador já votou neste mês
            bool hasVoted = await _voteRepository.HasUserVotedThisMonth(vote.UserId);

            if (hasVoted)
            {
                return BadRequest("Já votou este mês.");
            }

            // Inserir dados do voto na Base de Dados
            await _voteRepository.AddVote(vote);

            return Ok("Voto registado com sucesso!");
        }
        catch (Exception ex)
        {
            return StatusCode(500, $"Erro ao registrar voto: {ex.Message}");
        }
        
    }

}