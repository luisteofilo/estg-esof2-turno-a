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
    
public class LikeService {
    private readonly ApplicationDbContext _context;

    public LikeService(ApplicationDbContext context)
    {
        _context = context;
    }

    public List<ResponseLikeDto> GetLikes(Guid videoId)
    {
        try
        {
            return _context.Likes
                .Include(l => l.User)
                .Include(l => l.Video)
                .Where(l => l.VideoId == videoId)
                .Select(like => new ResponseLikeDto
                {
                    userid = like.UserId,
                    videoid = like.VideoId,
                    created_at = like.CreatedAt,
                }).ToList();
        }
        catch (Exception ex)
        {
            throw new Exception("An error occurred while retrieving likes.", ex);
        }
    }

    public ResponseLikeDto GetLikeById(Guid userId, Guid videoId)
    {
        var like = _context.Likes
            .Include(l => l.User)
            .Include(l => l.Video)
            .FirstOrDefault(l => l.UserId == userId && l.VideoId == videoId);

        if (like == null)
        {
            throw new ArgumentException("Like not found.");
        }

        return new ResponseLikeDto
        {
            userid = like.UserId,
            videoid = like.VideoId,
            created_at = like.CreatedAt,
        };
    }

    public ResponseLikeDto CreateLike(CreateLikeDto createLikeDto)
    {
        try
        {
            var user = _context.Users.Find(createLikeDto.userid);
            if (user == null)
            {
                throw new ArgumentException("User not found.");
            }

            var video = _context.Videos.Find(createLikeDto.videoid);
            if (video == null)
            {
                throw new ArgumentException("Video not found.");
            }

            var like = new Like
            {
                UserId = createLikeDto.userid,
                VideoId = createLikeDto.videoid,
                CreatedAt = createLikeDto.created_at
            };

            _context.Likes.Add(like);
            _context.SaveChanges();

            return new ResponseLikeDto
            {
                userid = like.UserId,
                videoid = like.VideoId,
                created_at = like.CreatedAt,
            };
        }
        catch (DbUpdateException ex)
        {
            throw new Exception("An error occurred while creating the like.", ex);
        }
    }
    
    public void DeleteLike(Guid userId, Guid videoId)
    {
        using (var transaction = _context.Database.BeginTransaction())
        {
            try
            {
                var like = _context.Likes
                    .FirstOrDefault(l => l.UserId == userId && l.VideoId == videoId);

                if (like == null)
                {
                    throw new ArgumentException("Like not found.");
                }

                _context.Likes.Remove(like);
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

