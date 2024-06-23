using Microsoft.AspNetCore.Mvc;
using ESOF.WebApp.DBLayer.Entities;
using ESOF.WebApp.DBLayer.Context;
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
    public async Task<ActionResult<IEnumerable<Game>>> GetGames()
    {
        try
        {
            var games = await _context.Games.ToListAsync();
            return Ok(games);
        }
        catch (Exception ex)
        {
            // Log exception
            Console.WriteLine($"Erro ao buscar jogos: {ex.Message}");
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