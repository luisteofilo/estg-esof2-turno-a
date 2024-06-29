using ESOF.WebApp.DBLayer.Context;
using ESOF.WebApp.WebAPI.Services;
using Helpers.Models;
using Microsoft.AspNetCore.Mvc;

namespace ESOF.WebApp.WebAPI.Controllers;

[Route("api/[controller]")]
[ApiController]
public class SpeedRunsController : ControllerBase
{
    private readonly SpeedRunService _speedRunService;

    public SpeedRunsController( )
    {
        _speedRunService = new SpeedRunService(new ApplicationDbContext());
    }

    [HttpGet("games")]
    public ActionResult<IEnumerable<GameViewModel>> GetGames()
    {
        return Ok(_speedRunService.GetGames());
    }
    
    // user por email
    [HttpGet("user/{email}")]
    public ActionResult<UserSpeedRunsViewModel> GetUserByEmail(string email)
    {
        return Ok(_speedRunService.GetUserByEmail(email));
    }
    
    // users
    [HttpGet("users")]
    public ActionResult<IEnumerable<UserSpeedRunsViewModel>> GetUsers()
    {
        return Ok(_speedRunService.GetUsers());
    }

    [HttpGet("moderators")]
    public ActionResult<IEnumerable<SpeedrunModeratorViewModel>> GetSpeedRunModerators()
    {
        return Ok(_speedRunService.GetSpeedRunModerators());
    }
    
    // add moderator
    [HttpPost("moderators/add/{userID:guid}/{gameID:guid}")]
    public ActionResult<SpeedrunModeratorViewModel> AddModerator(Guid userID, Guid gameID)
    {
        return Ok(_speedRunService.AddModerator(userID, gameID));
    }
    
    // ver as categorias que um utilizador é moderador
    [HttpGet("moderators/games/{userID:guid}")]
    public ActionResult<IEnumerable<GameViewModel>> GetModeratorGamesByUser(Guid userID)
    {
        return Ok(_speedRunService.GetModeratorGamesByUser(userID));
    }
    

    [HttpGet("runs/{categoryID}")]
    public ActionResult<IEnumerable<SpeedrunRunViewModel>> GetRunsByCategory(Guid categoryID)
    {
        var runs = _speedRunService.GetRunsByCategory(categoryID);
        if (runs == null)
        {
            return NotFound();
        }
        return Ok(runs);
    }
    
    // ver as runs de um jogador
    [HttpGet("runs/player/{playerID:guid}")]
    public ActionResult<IEnumerable<SpeedrunRunViewModel>> GetRunsByPlayer(Guid playerID)
    {
        return Ok(_speedRunService.GetRunsByPlayer(playerID));
    }

    [HttpGet("runs")]
    public ActionResult<IEnumerable<SpeedrunRunViewModel>> GetSpeedRunRuns()
    {
        return Ok(_speedRunService.GetSpeedRunRuns());
    }
    
    [HttpGet("runs/verify")]
    public ActionResult<IEnumerable<SpeedrunRunViewModel>> GetSpeedRunRunsToVerify()
    {
        return Ok(_speedRunService.GetSpeedRunRunsToVerify());
    }

    [HttpGet("categories")]
    public ActionResult<IEnumerable<SpeedrunCategoryViewModel>> GetSpeedRunCategories()
    {
        return Ok(_speedRunService.GetSpeedRunCategories());
    }
    
    // categoria por id
    [HttpGet("categorie/{categoryID:guid}")]
    public ActionResult<SpeedrunCategoryViewModel> GetCategory(Guid categoryID)
    {
        return Ok(_speedRunService.GetCategory(categoryID));
    }
    
    // adicionar categoria 
    [HttpPost("categories/add/{gameID:guid}/{categoryName}/{categoryDescription}/{categoryRules}")]
    public ActionResult<SpeedrunCategoryViewModel> AddCategory(Guid gameID, string categoryName, string categoryDescription, string categoryRules)
    {
        return Ok(_speedRunService.AddSpeedrunCategory(gameID, categoryName, categoryDescription, categoryRules));
    }
    
    // atualizar categoria
    
    [HttpPut("categories/update/{categoryID:guid}/{categoryName}/{categoryDescription}/{categoryRules}")]
    public ActionResult<SpeedrunCategoryViewModel> UpdateCategory(Guid categoryID, string categoryName, string categoryDescription, string categoryRules)
    {
        return Ok(_speedRunService.UpdateCategory(categoryID, categoryName, categoryDescription, categoryRules));
    }
    
    // eliminar categoria
    [HttpDelete("categories/delete/{categoryID:guid}")]
    public ActionResult<SpeedrunCategoryViewModel> DeleteCategory(Guid categoryID)
    {
        return Ok(_speedRunService.DeleteCategory(categoryID));
    }

    [HttpGet("categories/{gameID}")]
    public ActionResult<IEnumerable<SpeedrunCategoryViewModel>> GetCategoriesByGame(Guid gameID)
    {
        return Ok(_speedRunService.GetCategoriesByGame(gameID));
    }

    [HttpPost("moderators")]
    public ActionResult<SpeedrunModeratorViewModel> PostSpeedRunModerator(SpeedrunModeratorViewModel moderator)
    {
        _speedRunService.AddSpeedrunModerator(moderator);
        return CreatedAtAction(nameof(PostSpeedRunModerator), new { id = moderator.ModeratorID }, moderator);
    }
    
    // moderador por game
    [HttpGet("moderators/byGame/{GameID:guid}")]
    public ActionResult<IEnumerable<SpeedrunModeratorViewModel>> GetModeratorsByGame(Guid GameID)
    {
        return Ok(_speedRunService.GetModeratorsByGame(GameID));
    }
    
    // delete moderator 
    [HttpDelete("moderators/delete/{moderatorID:guid}")]
    public ActionResult<SpeedrunModeratorViewModel> DeleteModerator(Guid moderatorID)
    {
        return Ok(_speedRunService.DeleteModerator(moderatorID));
    }

    [HttpPost("runs/{playerID:guid}/{categoryID:guid}/{runTime:int}/{videoLink}")]
    public IActionResult PostSpeedRunRun(Guid playerID, Guid categoryID, int runTime, string videoLink)
    {
        try
        {
            _speedRunService.AddSpeedrunRun(playerID, categoryID, runTime, videoLink);
            return Ok(new { message = "Run added successfully", success = true });
        }
        catch (Exception ex)
        {
            // Log o erro para debug, se necessário
            Console.WriteLine($"Erro ao adicionar speedrun: {ex.Message}");
            return BadRequest(new { message = "Failed to add run", success = false });
        }
    }


    [HttpPost("categories")]
    public ActionResult<SpeedrunCategoryViewModel> PostSpeedRunCategory(SpeedrunCategoryViewModel category)
    {
        _speedRunService.AddSpeedrunCategory(category);
        return CreatedAtAction(nameof(PostSpeedRunCategory), new { id = category.CategoryID }, category);
    }

    [HttpPut("moderators")]
    public ActionResult<SpeedrunModeratorViewModel> PutSpeedRunModerator(SpeedrunModeratorViewModel moderator)
    {
        _speedRunService.UpdateSpeedrunModerator(moderator);
        return Ok(moderator);
    }

    [HttpPut("runs")]
    public ActionResult<SpeedrunRunViewModel> PutSpeedRunRun(SpeedrunRunViewModel run)
    {
        _speedRunService.UpdateSpeedrunRun(run);
        return Ok(run);
    }
    
    // apenas atulizar uma run para verificada
    [HttpPut("runs/verify/{runID:guid}/{verifier:guid}/{verify:bool}")]
    public ActionResult<SpeedrunRunViewModel> VerifyRun(Guid runID, Guid verifier, bool verify)
    {
        _speedRunService.VerifyRun(runID, verifier, verify);
        return Ok();
    }

    [HttpPut("categories")]
    public ActionResult<SpeedrunCategoryViewModel> PutSpeedRunCategory(SpeedrunCategoryViewModel category)
    {
        _speedRunService.UpdateSpeedrunCategory(category);
        return Ok(category);
    }
}

