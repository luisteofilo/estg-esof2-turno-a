using ESOF.WebApp.DBLayer.Context;
using ESOF.WebApp.WebAPI.DtoClasses;
using ESOF.WebApp.WebAPI.DtoClasses.Response;
using ESOF.WebApp.WebAPI.DtoClasses.Update;
using ESOF.WebApp.WebAPI.Services.Marketplace;
using Microsoft.AspNetCore.Mvc;

namespace ESOF.WebApp.WebAPI.Controllers.Marketplace
{
    [Route("api/marketplace/[controller]")]
    [ApiController]
    public class PlatformController : ControllerBase {
        private readonly PlatformService _platformService = new(new ApplicationDbContext());

        [HttpGet]
        public ActionResult<List<ResponsePlatformDto>> GetAllPlatforms() {
            return _platformService.GetAllPlatforms();
        }
        
        [HttpGet("{id:guid}")]
        public ActionResult<ResponsePlatformDto> GetPlatformById(Guid id) {
            return _platformService.GetPlatformById(id);
        }
        
        [HttpPost("add")]
        public ActionResult<ResponsePlatformDto> CreatePlatform(CreatePlatformDto platform) {
            return _platformService.CreatePlatform(platform);
        }
        
        [HttpPost("update")]
        public async Task<ActionResult<ResponsePlatformDto>> UpdatePlatform(Guid id, UpdatePlatformDto platform) {
            try {
                return await _platformService.UpdatePlatform(id, platform);;
            }
            catch (Exception e) {
                return NotFound();
            }
        }
        
        [HttpDelete("delete")]
        public async Task<IActionResult> DeletePlatform(Guid id) {
            try {
                await _platformService.DeletePlatform(id);
                return NoContent();
            }
            catch (Exception e) {
                return NotFound();
            }
        }
    }
}
