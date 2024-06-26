using System.ComponentModel.DataAnnotations;
using ESOF.WebApp.DBLayer.Context;
using ESOF.WebApp.DBLayer.Entities;
using Microsoft.AspNetCore.Mvc;

namespace ESOF.WebApp.WebAPI.Controllers;

[ApiController]
[Route("[controller]")]
public class GameReplaysController : ControllerBase
{
        

    [HttpGet]
    public IActionResult GetGameReplays()
    {
        var db = new ApplicationDbContext();
        var gameReplays = db.GameReplays
            .Select(g => new
            {
                g.Id,
                g.Title,
                g.UploadDate,
                g.User.Email
            }).ToList();

        return Ok(gameReplays);
    }

     [HttpGet("{id:guid}")]
     public IActionResult GetGameReplay(Guid id)
     {
         var db = new ApplicationDbContext();
         var gameReplay = db.GameReplays
             .Where(g => g.Id == id)
             .Select(g => new
             {
                 g.Title,
                 g.UploadDate,
                 g.VideoData
             })
             .FirstOrDefault();

         if (gameReplay == null)
         {
             return NotFound();
         }

         return Ok(gameReplay);
     }

     [HttpPost]
     public async Task<IActionResult> CreateGameReplay([Required][FromForm] string title, [Required] IFormFile videoFile, [Required][FromForm] Guid UserID)
     {
         if (videoFile == null || string.IsNullOrEmpty(title) || string.IsNullOrEmpty(UserID.ToString()))
         {
             return BadRequest("Title, video file and UserID are required.");
         }
        
         var db = new ApplicationDbContext();
         using var memoryStream = new MemoryStream();
         await videoFile.CopyToAsync(memoryStream);
         var videoData = memoryStream.ToArray();

         if (videoData.Length == 0)
         {
             return BadRequest("Video data is required.");
         }

         if (videoData.Length > 1073741824)
         {
             return BadRequest("Video file is too large. Maximum size allowed is 1 GB.");
         }
         
         // Upload to a file path (Uploads)
         var filePath = Path.Combine("Uploads", videoFile.FileName);

         var gameReplay = new GameReplay
         {
             Title = title,
             UploadDate = DateTime.UtcNow,
             VideoData = videoData,
             FilePath = filePath,
             UserId = UserID
         };

         db.GameReplays.Add(gameReplay);
         await db.SaveChangesAsync();

         return CreatedAtAction(nameof(GetGameReplay), new { id = gameReplay.Id }, gameReplay);
     }
}
     
 


