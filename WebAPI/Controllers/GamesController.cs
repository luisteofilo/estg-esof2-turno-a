using AutoMapper;
using ESOF.WebApp.DBLayer.Context;
using ESOF.WebApp.DBLayer.Entities;
using ESOF.WebApp.DBLayer.ViewModel;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ESOF.WebApp.WebAPI.Controllers;

public class GamesController : ControllerBase
{

    private readonly IMapper _mapper;

    public GamesController(IMapper mapper)
    {
        _mapper = mapper;
    }


    [HttpGet("games")]
    public async Task<ActionResult<IEnumerable<GameDto>>> GetGames()
    {
        var context = new ApplicationDbContext();
        var games = await context.Games.ToListAsync();
        var gameDtos = _mapper.Map<List<GameDto>>(games);
        return Ok(gameDtos);
    }

    [HttpGet("game/{id}")]
    public async Task<ActionResult<GameDto>> GetGame(Guid id)
    {
        var context = new ApplicationDbContext();
        var game = await context.Games.FindAsync(id);

        if (game == null)
        {
            return NotFound();
        }
        var gameDto = _mapper.Map<GameDto>(game);
        return Ok(gameDto);
    }

    [HttpPost("game")]
    public async Task<ActionResult<GameDto>> PostGame([FromBody] GameDto gameDto)
    {
        var context = new ApplicationDbContext();
        var game = _mapper.Map<Game>(gameDto);
        context.Games.Add(game);
        await context.SaveChangesAsync();

        return CreatedAtAction("GetGame", new { id = game.GameId }, _mapper.Map<GameDto>(game));
    }

    [HttpPut("game/{id}")]
    public async Task<ActionResult<Game>> Update(Guid id, [FromBody] GameDto gamesDto)
    {
        var context = new ApplicationDbContext();
        var game = await context.Games.FindAsync(id);

        if (game == null)
        {
            return NotFound();
        }

        _mapper.Map(gamesDto, game);
        
        
        await context.SaveChangesAsync();
        return Ok(_mapper.Map<GameDto>(game));
    }

    [HttpDelete("game/{id}")]
    public async Task<ActionResult<Game>> Delete(Guid id)
    {

        var context = new ApplicationDbContext();
        var game = await context.Games.FindAsync(id);

        if (game == null)
        {
            return NotFound();
        }

        context.Games.Remove(game);
        await context.SaveChangesAsync();
        return NoContent();
    }
}