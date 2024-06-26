using ESOF.WebApp.DBLayer.Context;
using ESOF.WebApp.WebAPI.DtoClasses.Create;
using ESOF.WebApp.WebAPI.DtoClasses.Response;
using ESOF.WebApp.WebAPI.DtoClasses.Update;
using ESOF.WebApp.WebAPI.Services;
using Microsoft.AspNetCore.Mvc;

namespace ESOF.WebApp.WebAPI.Controllers;

[Route("Gametok/[controller]")]
    [ApiController]
    public class VideoQuestController : ControllerBase
    {
        private readonly VideoQuestService _videoQuestService = new(new ApplicationDbContext());

        [HttpGet("game/{gameId:guid}")]
        public ActionResult<List<ResponseVideoQuestDto>> GetVideoQuests(Guid gameId)
        {
            try
            {
                var videoQuests = _videoQuestService.GetVideoQuests(gameId);
                return Ok(videoQuests);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpGet("{videoQuestId:guid}")]
        public ActionResult<ResponseVideoQuestDto> GetVideoQuestById(Guid videoQuestId)
        {
            try
            {
                var videoQuest = _videoQuestService.GetVideoQuestById(videoQuestId);
                return Ok(videoQuest);
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
        public ActionResult<ResponseVideoQuestDto> CreateVideoQuest([FromBody] CreateVideoQuestDto createVideoQuestDto)
        {
            try
            {
                var videoQuest = _videoQuestService.CreateVideoQuest(createVideoQuestDto);
                return CreatedAtAction(nameof(GetVideoQuestById), new { videoQuestId = videoQuest.videoquestid }, videoQuest);
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

        [HttpPatch("{videoQuestId:guid}")]
        public ActionResult<ResponseVideoQuestDto> UpdateVideoQuest(Guid videoQuestId, [FromBody] UpdateVideoQuestDto updateVideoQuestDto)
        {
            try
            {
                var updatedVideoQuest = _videoQuestService.UpdateVideoQuest(videoQuestId, updateVideoQuestDto);
                return Ok(updatedVideoQuest);
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

        [HttpDelete("{videoQuestId:guid}")]
        public IActionResult DeleteVideoQuest(Guid videoQuestId)
        {
            try
            {
                _videoQuestService.DeleteVideoQuest(videoQuestId);
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