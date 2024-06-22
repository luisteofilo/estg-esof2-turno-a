using ESOF.WebApp.DBLayer.Context;
using ESOF.WebApp.DBLayer.Entities;
using ESOF.WebApp.WebAPI.DtoClasses;
using ESOF.WebApp.WebAPI.DtoClasses.Response;
using ESOF.WebApp.WebAPI.DtoClasses.Update;
using Microsoft.EntityFrameworkCore;

namespace ESOF.WebApp.WebAPI.Services;

public class PlatformService
{
    private readonly ApplicationDbContext _context;

    public PlatformService(ApplicationDbContext context)
    {
        _context = context;
    }

    public List<ResponsePlatformDto> GetAllPlatforms()
    {
        try
        {
            return _context.Platforms.Select(platform => new ResponsePlatformDto
            {
                id = platform.platform_id,
                name = platform.name,
                debut_year = platform.debut_year
            }).ToList();
        }
        catch (Exception ex)
        {
            throw new Exception("An error occurred while retrieving platforms.", ex);
        }
    }

    public ResponsePlatformDto GetPlatformById(Guid id)
    {
        var platform = _context.Platforms.Find(id);
        if (platform == null)
        {
            throw new ArgumentException("Platform not found.");
        }

        return new ResponsePlatformDto
        {
            id = platform.platform_id,
            name = platform.name,
            debut_year = platform.debut_year
        };
    }

    public ResponsePlatformDto CreatePlatform(CreatePlatformDto createPlatformDto)
    {
        try
        {
            var platform = new Platform
            {
                name = createPlatformDto.name,
                debut_year = createPlatformDto.debut_year
            };

            if (createPlatformDto.gameIds != null && createPlatformDto.gameIds.Any())
            {
                var games = _context.GamePlatforms.Where(g => createPlatformDto.gameIds.Contains(g.game_id)).ToList();
                platform.gamePlatform = games;
            }

            _context.Platforms.Add(platform);
            _context.SaveChanges();

            return new ResponsePlatformDto
            {
                id = platform.platform_id,
                name = platform.name,
                debut_year = platform.debut_year
            };
        }
        catch (DbUpdateException ex)
        {
            throw new Exception("An error occurred while creating the platform.", ex);
        }
    }

    public ResponsePlatformDto UpdatePlatform(Guid id, UpdatePlatformDto updatePlatformDto)
    {
        var platform = _context.Platforms.Find(id);

        if (platform == null)
        {
            throw new ArgumentException("Platform not found.");
        }

        platform.debut_year = updatePlatformDto.debut_year ?? platform.debut_year;

        _context.SaveChanges();

        return new ResponsePlatformDto
        {
            id = platform.platform_id,
            name = platform.name,
            debut_year = platform.debut_year
        };
    }

    public void DeletePlatform(Guid id)
    {
        using (var transaction = _context.Database.BeginTransaction())
        {
            try
            {
                var platform = _context.Platforms.Find(id);

                if (platform == null)
                {
                    throw new ArgumentException("Platform not found.");
                }

                _context.SaveChanges();
                transaction.Commit();
            }
            catch (Exception ex)
            {
                transaction.Rollback();
                throw ex;
            }
        }
    }
}
