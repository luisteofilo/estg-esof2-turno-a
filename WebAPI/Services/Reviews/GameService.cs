    using ESOF.WebApp.DBLayer.Context;
    using ESOF.WebApp.DBLayer.Entities;
    using Helpers.Models.Creation;
    using Helpers.Models.View;
    using Microsoft.EntityFrameworkCore;

    namespace ESOF.WebApp.WebAPI.Services;

    public class GameService(ApplicationDbContext db)
    {
        public async Task<Game> GetGameById(ViewGameByIdModel model)
        {
            var game = db.Games.FirstOrDefault(r => r.GameId == model.GameId);
            if (game == null)
            {
                throw new Exception($"Game with ID {model.GameId} not found");
            }
            return game;
        }
    }