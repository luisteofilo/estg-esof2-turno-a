using ESOF.WebApp.DBLayer.Context;
using Helpers.Models;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ESOF.WebApp.WebAPI.Services
{
    public class GameEmulatorService
    {
        private readonly ApplicationDbContext _context;

        public GameEmulatorService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<List<GamesViewModel>> GetGamesAsync()
        {
            var games = await _context.Games
                .AsNoTracking() // Otimização para leitura
                .Select(g => new GamesViewModel
                {
                    GameId = g.GameId,
                    Name = g.Name,
                    Description = g.Description,
                    UrlImage = g.Url_Image,
                    Publisher = g.Publisher,
                    ReleaseDate = g.ReleaseDate,
                    Price = g.Price
                })
                .ToListAsync();

            return games;
        }
    }
}