using ESOF.WebApp.DBLayer.Context;
using ESOF.WebApp.WebAPI.DtoClasses;
using ESOF.WebApp.WebAPI.DtoClasses.Response;
using ESOF.WebApp.WebAPI.DtoClasses.Update;
using ESOF.WebApp.WebAPI.Services.Marketplace;
using Microsoft.AspNetCore.Mvc;

namespace ESOF.WebApp.WebAPI.Controllers.Marketplace
{
    [Route("marketplace/[controller]")]
    [ApiController]
    public class GenreController : ControllerBase
    {
        private readonly GenreService _genreService = new(new ApplicationDbContext());

        [HttpGet]
        public ActionResult<List<ResponseGenreDto>> GetAllPlatforms() {
            return _genreService.GetAllGenres();
        }
        
        [HttpGet("{id:guid}")]
        public ActionResult<ResponseGenreDto> GetPlatformById(Guid id) {
            return _genreService.GetGenreById(id);
        }
        
        [HttpPost]
        public ActionResult<ResponseGenreDto> CreatePlatform(CreateGenreDto genre) {
            return _genreService.CreateGenre(genre);
        }
        
        [HttpPatch]
        public ActionResult<ResponseGenreDto> UpdatePlatform(Guid id, UpdateGenreDto genre) {
            return _genreService.UpdateGenre(id, genre);
        }
        
        [HttpDelete]
        public void DeletePlatform(Guid id) {
            _genreService.DeleteGenre(id);
        }
    }
}
