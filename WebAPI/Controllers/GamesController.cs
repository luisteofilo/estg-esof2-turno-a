using ESOF.WebApp.DBLayer.Context;
using ESOF.WebApp.DBLayer.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ESOF.WebApp.WebAPI.Controllers;

public class GamesController : ControllerBase
{
    
    
    [HttpGet("games")]
    public async Task<ActionResult<IEnumerable<Game>>> GetGames()
    {
        var context = new ApplicationDbContext();
        return await context.Games.ToListAsync();
    }

    [HttpGet("game/{id}")]
    public async Task<ActionResult<Game>> GetGame(Guid id)
    {
        var context = new ApplicationDbContext();
        var game = await context.Games.FindAsync(id);

        if (game == null)
        {
            return NotFound();
        }

        return game;
    }

    [HttpPost("game")]
    public async Task<ActionResult<Game>> PostGame([FromBody] Game game)
    {
        var context = new ApplicationDbContext();
        context.Games.Add(game);
        await context.SaveChangesAsync();

        return CreatedAtAction("GetGame", new { id = game.GameId }, game);
    }

    [HttpPut("game/{id}")]
    public async Task<ActionResult<Game>> Update(Guid id, [FromBody] Game updatedGame)
    {
        var context = new ApplicationDbContext();
        var game = await context.Games.FindAsync(id);

        if (game == null)
        {
            return NotFound();
        }

        game.Name = updatedGame.Name;
        game.Url_Image = updatedGame.Url_Image;
        game.ReleaseDate = updatedGame.ReleaseDate;
        game.Developer = updatedGame.Developer;
        game.Publisher = updatedGame.Publisher;
        game.Description = updatedGame.Description;
        game.Price = updatedGame.Price;
        
        
        await context.SaveChangesAsync();
        return Ok(game);
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