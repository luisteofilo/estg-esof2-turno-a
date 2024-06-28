using ESOF.WebApp.DBLayer.Context;
using ESOF.WebApp.DBLayer.Entities;
using ESOF.WebApp.WebAPI.DtoClasses;
using ESOF.WebApp.WebAPI.DtoClasses.Response;
using ESOF.WebApp.WebAPI.DtoClasses.Update;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ESOF.WebApp.WebAPI.Services.Marketplace;

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

    public async Task<ResponsePlatformDto> UpdatePlatform(Guid id, UpdatePlatformDto updatePlatformDto) {
        var platform = await _context.Platforms.FindAsync(id);

        if (platform == null) {
            throw new Exception("Platform not found.");
        }

        platform.debut_year = updatePlatformDto.debut_year ?? platform.debut_year;
        platform.name = updatePlatformDto.name;
        
        await _context.SaveChangesAsync();

        return new ResponsePlatformDto {
            id = platform.platform_id,
            name = platform.name,
            debut_year = platform.debut_year
        };
    }

    public async Task DeletePlatform(Guid id) {
        var platform = await _context.Platforms.FindAsync(id);

        if (platform == null) {
            throw new Exception("Platform not found.");
        }

        _context.Platforms.Remove(platform);
        await _context.SaveChangesAsync();
    }
}