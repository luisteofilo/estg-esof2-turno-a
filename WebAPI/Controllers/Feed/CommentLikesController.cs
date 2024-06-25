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
public class CommentLikesController : ControllerBase
{
    private readonly CommentLikesService _commentlikeService;

    public CommentLikesController()
    {
        _commentlikeService =  new CommentLikesService(new ApplicationDbContext());
    }

    [HttpGet("index")]
    public ActionResult<List<CommentsDto>> GetAllCommentLikes()
    {
        try
        {
            return Ok(_commentlikeService.GetAllCommentLikes());
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [HttpGet("show/{id}")]
    public ActionResult<CommentLikesDto> GetCommentLikeById(Guid idUser, Guid idComment)
    {
        try
        {
            return Ok(_commentlikeService.GetCommentLikesById(idUser, idComment));
        }
        catch (ArgumentException ex)
        {
            return NotFound(ex.Message);
        }
    }

    [HttpPost("store")]
    public ActionResult<CommentLikesDto> CreateCommentLike([FromBody] CommentLikesDto createCommentLikesDto)
    {
        try
        {
            var createdCommentLike = _commentlikeService.CreateCommentLike(createCommentLikesDto);
            return CreatedAtAction(nameof(GetCommentLikeById), new {  }, createdCommentLike);
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [HttpDelete("delete/{id}")]
    public ActionResult DeleteCommentLike(Guid idUser, Guid idComment)
    {
        try
        {
            _commentlikeService.DeleteCommentLike(idUser, idComment);
            return NoContent();
        }
        catch (Exception ex)
        {
            return NotFound(ex.Message);
        }
    }
}