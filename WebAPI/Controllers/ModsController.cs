using System.ComponentModel.DataAnnotations;
using ESOF.WebApp.DBLayer.Context;
using ESOF.WebApp.DBLayer.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ESOF.WebApp.WebAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
public class GameReplaysController : ControllerBase
{

    [HttpGet]
    [Route("/mods")]
    public IActionResult GetMods()
    {
        var db = new ApplicationDbContext();
        var mods = db.Mods
            .Include(m => m.Tags)
            .Select(m => new {
                m.ModId,
                m.Name,
                m.Game,
                m.Description,
                m.ReleaseDate,
                m.Author,
                m.Version,
                m.DownloadLink,
                m.DownloadCount,
                m.Rating,
                Tags = m.Tags.Select(t => new { t.TagId, t.Name, t.Description }).ToList()
            })
            .ToList();

        return Ok(mods);
    }

    // GET: api/tags
    [HttpGet]
    [Route("/tags")]
    public IActionResult GetTags()
    {
        var db = new ApplicationDbContext();
        var tags = db.ModTags.ToList();
        return Ok(tags);
    }

    // GET: api/mod/{modId:guid}
    [HttpGet]
    [Route("/mod/{modId:guid}")]
    public IActionResult GetModById(Guid modId)
    {
        var db = new ApplicationDbContext();
        var mod = db.Mods
            .Include(m => m.Tags)
            .Where(m => m.ModId == modId)
            .Select(m => new {
                m.ModId,
                m.Name,
                m.Game,
                m.Description,
                m.ReleaseDate,
                m.Author,
                m.Version,
                m.DownloadLink,
                m.DownloadCount,
                m.Rating,
                Tags = m.Tags.Select(t => new { t.TagId, t.Name, t.Description }).ToList()
            })
            .FirstOrDefault();

        if (mod == null)
        {
            return NotFound();
        }

        return Ok(mod);
    }

    // POST: api/mods
    [HttpPost]
    [Route("/mods")]
    public async Task<IActionResult> AddMod([FromBody] Mod mod)
    {
        var db = new ApplicationDbContext();
        if (mod == null)
        {
            return BadRequest("Mod is required.");
        }

        db.Mods.Add(mod);
        await db.SaveChangesAsync();
        return CreatedAtAction(nameof(GetModById), new { modId = mod.ModId }, mod);
    }
}

