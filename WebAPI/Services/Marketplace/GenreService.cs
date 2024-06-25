using ESOF.WebApp.DBLayer.Context;
using ESOF.WebApp.DBLayer.Entities.Marketplace;
using ESOF.WebApp.WebAPI.DtoClasses;
using ESOF.WebApp.WebAPI.DtoClasses.Response;
using ESOF.WebApp.WebAPI.DtoClasses.Update;
using Microsoft.EntityFrameworkCore;

namespace ESOF.WebApp.WebAPI.Services.Marketplace
{
    public class GenreService
    {
        private readonly ApplicationDbContext _context;

        public GenreService(ApplicationDbContext context)
        {
            _context = context;
        }

        public List<ResponseGenreDto> GetAllGenres()
        {
            try
            {
                return _context.Genres
                    .Include(g => g.gameGenres)
                    .ThenInclude(gg => gg.MarketPlaceGame)
                    .Select(genre => new ResponseGenreDto
                    {
                        id = genre.genre_id,
                        name = genre.name,
                        description = genre.description,
                        game_ids = genre.gameGenres.Select(gg => gg.game_id).ToList(),
                    }).ToList();
            }
            catch (Exception ex)
            {
                throw new Exception("An error occurred while retrieving genres.", ex);
            }
        }

        public ResponseGenreDto GetGenreById(Guid id)
        {
            var genre = _context.Genres
                .Include(g => g.gameGenres)
                .FirstOrDefault(g => g.genre_id == id);

            if (genre == null)
            {
                throw new ArgumentException("Genre not found.");
            }

            return new ResponseGenreDto
            {
                id = genre.genre_id,
                name = genre.name,
                description = genre.description,
                game_ids = genre.gameGenres.Select(gg => gg.game_id).ToList(),
            };
        }

        public ResponseGenreDto CreateGenre(CreateGenreDto createGenreDto)
        {
            try
            {
                var genre = new Genre
                {
                    genre_id = Guid.NewGuid(),
                    name = createGenreDto.name,
                    description = createGenreDto.description
                };

                _context.Genres.Add(genre);
                _context.SaveChanges();

                return new ResponseGenreDto
                {
                    id = genre.genre_id,
                    name = genre.name,
                    description = genre.description,
                    game_ids = new List<Guid>()
                };
            }
            catch (DbUpdateException ex)
            {
                throw new Exception("An error occurred while creating the genre.", ex);
            }
        }

        public ResponseGenreDto UpdateGenre(Guid id, UpdateGenreDto updateGenreDto)
        {
            var genre = _context.Genres.Find(id);

            if (genre == null)
            {
                throw new ArgumentException("Genre not found.");
            }

            genre.name = updateGenreDto.name ?? genre.name;
            genre.description = updateGenreDto.description ?? genre.description;

            _context.SaveChanges();

            return new ResponseGenreDto
            {
                id = genre.genre_id,
                name = genre.name,
                description = genre.description,
                game_ids = genre.gameGenres.Select(gg => gg.game_id).ToList()
            };
        }

        public void DeleteGenre(Guid id)
        {
            var genre = _context.Genres
                .Include(g => g.gameGenres)
                .FirstOrDefault(g => g.genre_id == id);

            if (genre == null)
            {
                throw new ArgumentException("Genre not found.");
            }

            _context.Genres.Remove(genre);
            _context.SaveChanges();
        }
    }
}
