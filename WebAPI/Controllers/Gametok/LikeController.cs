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
public class LikeController : ControllerBase
{
    private readonly LikeService _likeService = new(new ApplicationDbContext());
    
    [HttpGet("{videoId:guid}/{userId:guid}")]
    public ActionResult<bool> IsLiked(Guid videoId, Guid userId)
    {
        return _likeService.IsLiked(videoId, userId);
    }
    
    [HttpPost]
    public ActionResult<ResponseLikeDto> LikeVideo([FromForm] CreateLikeDto createLikeDto)
    {
        return _likeService.CreateLike(createLikeDto);
    }
    
    [HttpDelete("{videoId:guid}/{userId:guid}")]
    public IActionResult RemoveLike(Guid videoId, Guid userId)
    {
        try
        {
            _likeService.DeleteLike(videoId, userId);
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
}