﻿using ESOF.WebApp.DBLayer.Context;
using ESOF.WebApp.WebAPI.DtoClasses;
using ESOF.WebApp.WebAPI.DtoClasses.Response;
using ESOF.WebApp.WebAPI.DtoClasses.Update;
using ESOF.WebApp.WebAPI.Services.Marketplace;
using Microsoft.AspNetCore.Mvc;

namespace ESOF.WebApp.WebAPI.Controllers.Marketplace {
    [Route("api/marketplace/[controller]")]
    [ApiController]
    public class GameController : ControllerBase {
        private readonly GameService _gameService = new(new ApplicationDbContext());

        [HttpGet]
        public ActionResult<List<ResponseMKP_GameDto>> GetAllGames() {
            return _gameService.GetAllGames();
        }

        [HttpGet("{id:guid}")]
        public ActionResult<ResponseMKP_GameDto> GetGameById(Guid id) {
            return _gameService.GetGameById(id);
        }

        [HttpPost("add")]
        public ActionResult<ResponseMKP_GameDto> CreateGame(CreateMKP_GameDto game) {
            return _gameService.CreateGame(game);
        }

        [HttpPost("update")]
        public ActionResult<ResponseMKP_GameDto> UpdateGame(Guid id, UpdateMKP_GameDto game) {
            try {
                return _gameService.UpdateGame(id, game);
            }
            catch (Exception e) {
                return NotFound();
            }
        }

        [HttpDelete("delete")]
        public IActionResult DeleteGame(Guid id) {
            try {
                _gameService.DeleteGame(id);
                return NoContent();
            }
            catch (Exception e) {
                return NotFound();
            }
        }
    }
}