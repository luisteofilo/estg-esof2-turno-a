using ESOF.WebApp.DBLayer.Context;

namespace ESOF.WebApp.WebAPI.Services;

public class PlatformService {
  private readonly ApplicationDbContext _context;

  public PlatformService(ApplicationDbContext context) {
    _context = context;
  }
}