using ESOF.WebApp.WebAPI.DtoClasses;

namespace ESOF.WebApp.WebAPI.Services;
using System;
using System.Collections.Generic;
using System.Linq;
using ESOF.WebApp.DBLayer.Entities;
using ESOF.WebApp.DBLayer.Context;
using Microsoft.EntityFrameworkCore;

public class CommentsService
{
    private readonly ApplicationDbContext _context;

    public CommentsService(ApplicationDbContext context)
    {
        _context = context;
    }

    public List<CommentsDto> GetAllComments()
    {
        try
        {
            return _context.Comments.Select(comment => new CommentsDto
            {
                CommentId = comment.CommentId,
                text = comment.text,
                UserId = comment.UserId,
                PostId = comment.PostId
            }).ToList();
        }
        catch (Exception ex)
        {
            throw new Exception("An error occurred while retrieving comments.", ex);
        }
    }

    public CommentsDto GetCommentsById(Guid id)
    {
        var comment = _context.Comments.Find(id);
        if (comment == null)
        {
            throw new ArgumentException("Brand not found.");
        }

        return new CommentsDto
        {
            CommentId = comment.CommentId,
            text = comment.text,
            UserId = comment.UserId,
            PostId = comment.PostId
        };
    }

    public CommentsDto CreateComment(CommentsDto createCommentsDto)
    {
        try
        {
            var comment = new Comment
            {
                text = createCommentsDto.text,
                UserId = createCommentsDto.UserId,
                PostId = createCommentsDto.PostId
            };

            _context.Comments.Add(comment);
            _context.SaveChanges();

            return new CommentsDto
            {
                CommentId = comment.CommentId,
                text = comment.text,
                UserId = comment.UserId,
                PostId = comment.PostId            };
        }
        catch (DbUpdateException ex)
        {
            throw new Exception("An error occurred while creating the comment.", ex);
        }
    }

    public CommentsDto UpdateComments(Guid id, CommentsUpdateDto updateCommentsDto)
    {
        var comment = _context.Comments.Find(id);

        if (comment == null)
        {
            throw new ArgumentException("Comment not found.");
        }
        comment.text = updateCommentsDto.text?? comment.text;
        comment.UserId = updateCommentsDto.UserId?? comment.UserId;
        comment.PostId = updateCommentsDto.PostId?? comment.PostId;

        _context.SaveChanges();

        return new CommentsDto
        {
            CommentId = comment.CommentId,
            text = comment.text,
            UserId = comment.UserId,
            PostId = comment.PostId
        };
    }

    public void DeleteComment(Guid id)
    {
        using (var transaction = _context.Database.BeginTransaction())
        {
            try
            {
                var comment = _context.Comments.Find(id);

                if (comment == null)
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