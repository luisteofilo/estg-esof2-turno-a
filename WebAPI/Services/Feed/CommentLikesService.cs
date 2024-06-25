using ESOF.WebApp.WebAPI.DtoClasses;

namespace ESOF.WebApp.WebAPI.Services;
using System;
using System.Collections.Generic;
using System.Linq;
using ESOF.WebApp.DBLayer.Entities;
using ESOF.WebApp.DBLayer.Context;
using Microsoft.EntityFrameworkCore;

public class CommentLikesService
{
    private readonly ApplicationDbContext _context;

    public CommentLikesService(ApplicationDbContext context)
    {
        _context = context;
    }

    public List<CommentLikesDto> GetAllCommentLikes()
    {
        try
        {
            return _context.CommentLikes.Select(comment => new CommentLikesDto
            {
                CommentId = comment.CommentId,
                UserId = comment.UserId
            }).ToList();
        }
        catch (Exception ex)
        {
            throw new Exception("An error occurred while retrieving Comments Likes.", ex);
        }
    }

    public CommentLikesDto GetCommentLikesById(Guid UserId, Guid CommentId)
    {
        CommentLikesDto commentlikes = null;
        foreach (var c in _context.CommentLikes.Select(comments => new CommentLikesDto
                 {
                     CommentId = comments.CommentId,
                     UserId = comments.UserId
                 }).ToList())
        {
            if (c.CommentId == CommentId && c.UserId == UserId)
            {
                commentlikes = c;
            }
        }

        if (commentlikes == null)
        {
            throw new ArgumentException("Comment Likes not found.");
        }

        return commentlikes;
    }

    public CommentsDto CreateCommentLike(CommentLikesDto createCommentLikesDto)
    {
        try
        {
            var commentlikes = new CommentLike
            {
                CommentId = createCommentLikesDto.CommentId?? throw new Exception(),
                UserId = createCommentLikesDto.UserId?? throw new Exception()
            };

            _context.CommentLikes.Add(commentlikes);
            _context.SaveChanges();

            return new CommentsDto
            {
                CommentId = commentlikes.CommentId,
                UserId = commentlikes.UserId,
            };
        }
        catch (DbUpdateException ex)
        {
            throw new Exception("An error occurred while creating the comment like.", ex);
        }
    }
    public void DeleteCommentLike(Guid UserId, Guid CommentId)
    {
        using (var transaction = _context.Database.BeginTransaction())
        {
            try
            {
                CommentLikesDto commentlikes = null;
                foreach (var c in _context.CommentLikes.Select(comments => new CommentLikesDto
                         {
                             CommentId = comments.CommentId,
                             UserId = comments.UserId
                         }).ToList())
                {
                    if (c.CommentId == CommentId && c.UserId == UserId)
                    {
                        commentlikes = c;
                    }
                }
                if (commentlikes == null)
                {
                    throw new ArgumentException("Comment not found.");
                }
                
                _context.SaveChanges();
                transaction.Commit();
            }
            catch (Exception ex)
            {
                transaction.Rollback();
                throw ex;
            }
        }
    }
}