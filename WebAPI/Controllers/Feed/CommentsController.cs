using ESOF.WebApp.DBLayer.Context;
using ESOF.WebApp.WebAPI.DtoClasses;

namespace ESOF.WebApp.WebAPI.Controllers;
using System;
using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc;
using ESOF.WebApp.DBLayer.Entities;
using ESOF.WebApp.WebAPI.Services;

[Route("api/[controller]")]
[ApiController]
public class CommentsController : ControllerBase
{
    private readonly CommentsService _commentService;

    public CommentsController()
    {
        _commentService =  new CommentsService(new ApplicationDbContext());
    }

    [HttpGet("index")]
    public ActionResult<List<CommentsDto>> GetAllComments()
    {
        try
        {
            return Ok(_commentService.GetAllComments());
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [HttpGet("show/{id}")]
    public ActionResult<CommentsDto> GetCommentById(Guid id)
    {
        try
        {
            return Ok(_commentService.GetCommentsById(id));
        }
        catch (ArgumentException ex)
        {
            return NotFound(ex.Message);
        }
    }

    [HttpPost("store")]
    public ActionResult<CommentsDto> CreateComment([FromBody] CommentsDto createCommentsDto)
    {
        try
        {
            var createdComment = _commentService.CreateComment(createCommentsDto);
            return CreatedAtAction(nameof(GetCommentById), new { id = createdComment.CommentId }, createdComment);
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [HttpPut("update")]
    public ActionResult<CommentsDto> UpdateComment(Guid id, [FromBody] CommentsUpdateDto updateBrandDto)
    {
        try
        {
            return Ok(_commentService.UpdateComments(id, updateBrandDto));
        }
        catch (ArgumentException ex)
        {
            return NotFound(ex.Message);
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [HttpDelete("delete/{id}")]
    public ActionResult DeleteBrand(Guid id)
    {
        try
        {
            _commentService.DeleteComment(id);
            return NoContent();
        }
        catch (Exception ex)
        {
            return NotFound(ex.Message);
        }
    }
}