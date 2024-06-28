using ESOF.WebApp.DBLayer.Context;
using ESOF.WebApp.DBLayer.Entities;
using ESOF.WebApp.WebAPI.DtoClasses;
using ESOF.WebApp.WebAPI.DtoClasses.Response;
using ESOF.WebApp.WebAPI.DtoClasses.Update;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using ESOF.WebApp.WebAPI.DtoClasses.Create;

namespace ESOF.WebApp.WebAPI.Services;
    
public class CommentService {
    private readonly ApplicationDbContext _context;

    public CommentService(ApplicationDbContext context)
    {
        _context = context;
    }

    public List<ResponseCommentDto> GetComments(Guid videoId)
    {
        try
        {
            return _context.Comments
                .Include(c => c.User)
                .Include(c => c.Video)
                .Where(c => c.VideoId == videoId)
                .Select(comment => new ResponseCommentDto
                {
                    userid = comment.UserId,
                    videoid = comment.VideoId,
                    comment = comment.Text,
                    created_at = comment.CreatedAt,
                }).ToList();
        }
        catch (Exception ex)
        {
            throw new Exception("An error occurred while retrieving comments.", ex);
        }
    }

    public ResponseCommentDto GetCommentById(Guid userId, Guid videoId)
    {
        var comment = _context.Comments
            .Include(c => c.User)
            .Include(c => c.Video)
            .FirstOrDefault(c => c.UserId == userId && c.VideoId == videoId);

        if (comment == null)
        {
            throw new ArgumentException("Comment not found.");
        }

        return new ResponseCommentDto
        {
            userid = comment.UserId,
            videoid = comment.VideoId,
            comment = comment.Text,
            created_at = comment.CreatedAt,
        };
    }

    public ResponseCommentDto CreateComment(CreateCommentDto createCommentDto, Guid userId, Guid videoId)
    {
        try
        {
            var user = _context.Users.Find(userId);
            if (user == null)
            {
                throw new ArgumentException("User not found.");
            }

            var video = _context.Videos.Find(videoId);
            if (video == null)
            {
                throw new ArgumentException("Video not found.");
            }

            var comment = new Comment
            {
                UserId = userId,
                VideoId = videoId,
                Text = createCommentDto.comment,
                CreatedAt = DateTime.UtcNow
            };

            _context.Comments.Add(comment);
            _context.SaveChanges();

            return new ResponseCommentDto
            {
                userid = comment.UserId,
                videoid = comment.VideoId,
                comment = comment.Text,
                created_at = comment.CreatedAt,
            };
        }
        catch (DbUpdateException ex)
        {
            throw new Exception("An error occurred while creating the comment.", ex);
        }
    }

    public ResponseCommentDto UpdateComment(Guid userId, Guid videoId, UpdateCommentDto updateCommentDto)
    {
        var comment = _context.Comments
            .FirstOrDefault(c => c.UserId == userId && c.VideoId == videoId);

        if (comment == null)
        {
            throw new ArgumentException("Comment not found.");
        }

        comment.Text = updateCommentDto.comment ?? comment.Text;

        _context.SaveChanges();

        return new ResponseCommentDto
        {
            userid = comment.UserId,
            videoid = comment.VideoId,
            comment = comment.Text,
            created_at = comment.CreatedAt,
        };
    }

    public void DeleteComment(Guid userId, Guid videoId)
    {
        using (var transaction = _context.Database.BeginTransaction())
        {
            try
            {
                var comment = _context.Comments
                    .FirstOrDefault(c => c.UserId == userId && c.VideoId == videoId);

                if (comment == null)
                {
                    throw new ArgumentException("Comment not found.");
                }

                _context.Comments.Remove(comment);
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
