using ESOF.WebApp.DBLayer.Context;
using ESOF.WebApp.WebAPI.Services;
using Microsoft.AspNetCore.Mvc;

namespace ESOF.WebApp.WebAPI.Controllers;
[Route("api/[controller]")]
[ApiController]
public class PlatformController : ControllerBase {
  private readonly PlatformService _platformService;

  public PlatformController() {
    _platformService = new PlatformService(new ApplicationDbContext());
  }
  //[HttpGet("index")]
 // public ActionResult<List<>
}