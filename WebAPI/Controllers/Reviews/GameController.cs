using ESOF.WebApp.DBLayer.Context;
using ESOF.WebApp.DBLayer.Entities;
using ESOF.WebApp.WebAPI.Services;
using global::Helpers.Models.View;
using global::Helpers.Models.Creation;
using Microsoft.AspNetCore.Mvc;

namespace ESOF.WebApp.WebAPI.Controllers.Reviews
{
    [Route("games")]
    [ApiController]
    public class GameController : ControllerBase
    {
        private readonly GameService _gameService = new(new ApplicationDbContext());
        
        [HttpGet("{gameId:guid}")]
        public async Task<ActionResult<Game>> GetGameById(Guid gameId)
        {
            var game = await _gameService.GetGameById(new ViewGameByIdModel { GameId = gameId });
            return new ActionResult<Game>(game);
        }
    }
}