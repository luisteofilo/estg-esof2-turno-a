using System.ComponentModel.DataAnnotations;
using ESOF.WebApp.DBLayer.Context;
using ESOF.WebApp.DBLayer.Entities;
using ESOF.WebApp.WebAPI.DtoClasses.Create;
using ESOF.WebApp.WebAPI.DtoClasses.Response;
using ESOF.WebApp.WebAPI.DtoClasses.Update;
using ESOF.WebApp.WebAPI.Services;
using Microsoft.AspNetCore.Mvc;

namespace ESOF.WebApp.WebAPI.Controllers;

[Route("Gametok/[controller]")]
[ApiController]
public class VideoController : ControllerBase
{
    private readonly VideoService _videoService = new(new ApplicationDbContext());

    [HttpGet]
    public ActionResult<List<ResponseVideoDto>> GetAllVideos()
    {
        return _videoService.GetAllVideos();
    }

    [HttpGet("{id:guid}")]
    public ActionResult<ResponseVideoDto> GetVideoById(Guid id)
    {
        try
        {
            return _videoService.GetVideoById(id);
        }
        catch (ArgumentException)
        {
            return NotFound();
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpPost]
    public async Task<ActionResult<ResponseVideoDto>> CreateVideo([FromForm] CreateVideoDto createVideoDto)
    {
        try
        {
            return await _videoService.CreateVideo(createVideoDto);
        }
        catch (ArgumentException ex)
        {
            return NotFound(new { message = ex.Message });
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpPatch("{id:guid}")]
    public ActionResult<ResponseVideoDto> UpdateVideo(Guid id, [FromBody] UpdateVideoDto updateVideoDto)
    {
        try
        {
            return _videoService.UpdateVideo(id, updateVideoDto);
        }
        catch (ArgumentException)
        {
            return NotFound();
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }
    
    [HttpPatch("{id:guid}/increment")]
    public ActionResult<ResponseVideoDto> IncrementViewCount(Guid id)
    {
        try
        {
            Console.WriteLine($"IncrementViewCount method called for video id: {id}");
            var result = _videoService.IncrementViewCount(id);
            Console.WriteLine($"View count incremented successfully for video id: {id}");

            return result;
        }
        catch (ArgumentException)
        {
            return NotFound();
        }
        catch (Exception ex)
        {

            Console.WriteLine($"Error incrementing view count for video id {id}: {ex.Message}");
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpDelete("{id:guid}")]
    public IActionResult DeleteVideo(Guid id)
    {
        try
        {
            _videoService.DeleteVideo(id);
            return NoContent();
        }
        catch (ArgumentException)
        {
            return NotFound();
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpGet("random")]
    public ActionResult<ResponseVideoDto> GetRandomVideo()
    {
        try
        {
            return _videoService.GetRandomVideo();
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }
}