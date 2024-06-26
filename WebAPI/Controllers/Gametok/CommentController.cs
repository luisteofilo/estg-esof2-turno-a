using ESOF.WebApp.DBLayer.Context;
using ESOF.WebApp.WebAPI.DtoClasses;
using ESOF.WebApp.WebAPI.DtoClasses.Response;
using ESOF.WebApp.WebAPI.DtoClasses.Update;
using ESOF.WebApp.WebAPI.DtoClasses.Create;
using ESOF.WebApp.WebAPI.Services;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;

namespace ESOF.WebApp.WebAPI.Controllers;

[Route("/Gametok/[controller]")]
    [ApiController]
    public class CommentController : ControllerBase
    {
        private readonly CommentService _commentService;

        public CommentController(ApplicationDbContext context)
        {
            _commentService = new CommentService(context);
        }

        [HttpGet("video/{videoId:guid}")]
        public ActionResult<List<ResponseCommentDto>> GetComments(Guid videoId)
        {
            try
            {
                return _commentService.GetComments(videoId);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpGet("{userId:guid}/{videoId:guid}")]
        public ActionResult<ResponseCommentDto> GetCommentById(Guid userId, Guid videoId)
        {
            try
            {
                return _commentService.GetCommentById(userId, videoId);
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

        [HttpPost("{userId:guid}/{videoId:guid}")]
        public ActionResult<ResponseCommentDto> CreateComment([FromBody] CreateCommentDto createCommentDto, Guid userId, Guid videoId)
        {
            try
            {
                return _commentService.CreateComment(createCommentDto, userId, videoId);
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

        [HttpPatch("{userId:guid}/{videoId:guid}")]
        public ActionResult<ResponseCommentDto> UpdateComment(Guid userId, Guid videoId, [FromBody] UpdateCommentDto updateCommentDto)
        {
            try
            {
                return _commentService.UpdateComment(userId, videoId, updateCommentDto);
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

        [HttpDelete("{userId:guid}/{videoId:guid}")]
        public IActionResult DeleteComment(Guid userId, Guid videoId)
        {
            try
            {
                _commentService.DeleteComment(userId, videoId);
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