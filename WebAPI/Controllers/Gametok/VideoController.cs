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
    private readonly VideoService _videoService;

    public VideoController(ApplicationDbContext context)
    {
        _videoService = new VideoService(context);
    }

    [HttpGet]
    public ActionResult<List<ResponseVideoDto>> GetAllVideos()
    {
        try
        {
            return _videoService.GetAllVideos();
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
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
    public ActionResult<ResponseVideoDto> CreateVideo([FromBody] CreateVideoDto createVideoDto)
    {
        try
        {
            return _videoService.CreateVideo(createVideoDto);
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

    [HttpPost("random/fromlist")]
    public ActionResult<ResponseVideoDto> GetRandomVideoFromList([FromBody] List<Guid> videoIds)
    {
        try
        {
            return _videoService.GetRandomVideoFromList(videoIds);
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }
}