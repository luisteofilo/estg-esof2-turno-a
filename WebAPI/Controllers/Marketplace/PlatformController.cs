using ESOF.WebApp.DBLayer.Context;
using ESOF.WebApp.WebAPI.DtoClasses.Response;
using ESOF.WebApp.WebAPI.Services.Marketplace;
using Microsoft.AspNetCore.Mvc;

namespace ESOF.WebApp.WebAPI.Controllers.Marketplace;
[Route("api/[controller]")]
[ApiController]
public class PlatformController : ControllerBase {
  private readonly PlatformService _platformService;

  public PlatformController() {
    _platformService = new PlatformService(new ApplicationDbContext());
  }
  [HttpGet("index")] 
  public ActionResult<List<ResponsePlatformDto>> GetAllPlatforms() {
    return _platformService.GetAllPlatforms();
  }
}