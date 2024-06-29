using ESOF.WebApp.WebAPI.Services;
using Helpers.Models;
using Microsoft.AspNetCore.Mvc;

namespace ESOF.WebApp.WebAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class EmulatorGamesController : ControllerBase
    {
        private readonly GameEmulatorService _gameEmulatorService;
        private readonly RomEmulatorService _romEmulatorService;

        public EmulatorGamesController(GameEmulatorService gameEmulatorService, RomEmulatorService romEmulatorService)
        {
            _gameEmulatorService = gameEmulatorService;
            _romEmulatorService = romEmulatorService;
        }

        // GET: api/Games
        [HttpGet]
        public async Task<IActionResult> GetGames()
        {
            var games = await _gameEmulatorService.GetGamesAsync();
            return Ok(games);
        }

        // GET: api/Games/{GameID}
        [HttpGet("{GameID:guid}")]
        public async Task<ActionResult<IEnumerable<RomsViewModel>>> GetRoms(Guid GameID)
        {
            var roms = await _romEmulatorService.GetRomsByGameIdAsync(GameID);

            if (roms == null || !roms.Any())
            {
                return NotFound();
            }

            return Ok(roms);
        }
    }
}