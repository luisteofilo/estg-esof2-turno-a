using ESOF.WebApp.DBLayer.Context;
using ESOF.WebApp.DBLayer.Entities;
using ESOF.WebApp.WebAPI.DtoClasses;
using ESOF.WebApp.WebAPI.DtoClasses.Create;
using ESOF.WebApp.WebAPI.DtoClasses.Response;
using ESOF.WebApp.WebAPI.DtoClasses.Update;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;

namespace ESOF.WebApp.WebAPI.Services;

public class VideoService {
    private readonly ApplicationDbContext _context;

    public VideoService(ApplicationDbContext context)
    {
        _context = context;
    }
    
    public List<ResponseVideoDto> GetAllVideos()
    {
        try
        {
            return _context.Videos
                .Include(v => v.User)
                .Include(v => v.VideoQuest)
                .Select(video => new ResponseVideoDto
                {
                    videoid = video.VideoId,
                    userid = video.UserId,
                    videoquestid = video.VideoQuestId,
                    videopath = video.VideoPath,
                    caption = video.Caption,
                    viewcount = video.ViewCount,
                    created_at = video.CreatedAt,
                    likes = video.Likes.Select(l => new ResponseLikeDto
                    {
                        userid = l.UserId,
                        videoid = l.VideoId,
                        created_at = l.CreatedAt
                    }).ToList(),
                    comments = video.Comments.Select(c => new ResponseCommentDto
                    {
                        userid = c.UserId,
                        videoid = c.VideoId,
                        comment = c.Text,
                        created_at = c.CreatedAt
                    }).ToList()
                }).ToList();
        }
        catch (Exception ex)
        {
            throw new Exception("An error occurred while retrieving videos.", ex);
        }
    }

    public List<ResponseVideoDto> GetVideos(Guid videoQuestId)
    {
        try
        {
            return _context.Videos
                .Include(v => v.User)
                .Include(v => v.VideoQuest)
                .Include(v => v.Likes)
                .Include(v => v.Comments)
                .Where(v => v.VideoQuestId == videoQuestId)
                .Select(video => new ResponseVideoDto
                {
                    videoid = video.VideoId,
                    videoquestid = video.VideoQuestId,
                    userid = video.UserId,
                    caption = video.Caption,
                    viewcount = video.ViewCount,
                    like_ids = video.Likes.Select(l => l.UserId).ToList(),
                    comment_ids = video.Comments.Select(c => c.UserId).ToList(),
                    likes = video.Likes.Select(l => new ResponseLikeDto
                    {
                        userid = l.UserId,
                        videoid = l.VideoId,
                        created_at = l.CreatedAt
                    }).ToList(),
                    comments = video.Comments.Select(c => new ResponseCommentDto
                    {
                        userid = c.UserId,
                        videoid = c.VideoId,
                        comment = c.Text,
                        created_at = c.CreatedAt
                    }).ToList()
                }).ToList();
        }
        catch (Exception ex)
        {
            throw new Exception("An error occurred while retrieving videos.", ex);
        }
    }

    public ResponseVideoDto GetVideoById(Guid videoId)
    {
        var video = _context.Videos
            .Include(v => v.User)
            .Include(v => v.VideoQuest)
            .Include(v => v.Likes)
            .Include(v => v.Comments)
            .FirstOrDefault(v => v.VideoId == videoId);

        if (video == null)
        {
            throw new ArgumentException("Video not found.");
        }

        return new ResponseVideoDto
        {
            videoid = video.VideoId,
            videoquestid = video.VideoQuestId,
            userid = video.UserId,
            caption = video.Caption,
            viewcount = video.ViewCount,
            like_ids = video.Likes.Select(l => l.UserId).ToList(),
            comment_ids = video.Comments.Select(c => c.UserId).ToList(),
            likes = video.Likes.Select(l => new ResponseLikeDto
            {
                userid = l.UserId,
                videoid = l.VideoId,
                created_at = l.CreatedAt
            }).ToList(),
            comments = video.Comments.Select(c => new ResponseCommentDto
            {
                userid = c.UserId,
                videoid = c.VideoId,
                comment = c.Text,
                created_at = c.CreatedAt
            }).ToList()
        };
    }

    public ResponseVideoDto CreateVideo(CreateVideoDto createVideoDto)
    {
        try
        {
            var user = _context.Users.Find(createVideoDto.userid);
            if (user == null)
            {
                throw new ArgumentException("User not found.");
            }

            var videoQuest = _context.VideoQuests.Find(createVideoDto.challengeid);
            if (videoQuest == null)
            {
                throw new ArgumentException("VideoQuest not found.");
            }

            var video = new Video
            {
                VideoId = Guid.NewGuid(),
                UserId = createVideoDto.userid,
                VideoQuestId = createVideoDto.challengeid,
                Caption = createVideoDto.caption,
                ViewCount = createVideoDto.viewcount,
                CreatedAt = DateTime.UtcNow
            };

            _context.Videos.Add(video);
            _context.SaveChanges();

            return new ResponseVideoDto
            {
                videoid = video.VideoId,
                videoquestid = video.VideoQuestId,
                userid = video.UserId,
                caption = video.Caption,
                viewcount = video.ViewCount,
                like_ids = new List<Guid>(),
                comment_ids = new List<Guid>(),
                likes = new List<ResponseLikeDto>(),
                comments = new List<ResponseCommentDto>()
            };
        }
        catch (DbUpdateException ex)
        {
            throw new Exception("An error occurred while creating the video.", ex);
        }
    }

    public ResponseVideoDto UpdateVideo(Guid videoId, UpdateVideoDto updateVideoDto)
    {
        var video = _context.Videos.FirstOrDefault(v => v.VideoId == videoId);

        if (video == null)
        {
            throw new ArgumentException("Video not found.");
        }

        video.Caption = updateVideoDto.caption ?? video.Caption;
        video.ViewCount = updateVideoDto.viewcount ?? video.ViewCount;

        _context.SaveChanges();

        return new ResponseVideoDto
        {
            videoid = video.VideoId,
            videoquestid = video.VideoQuestId,
            userid = video.UserId,
            caption = video.Caption,
            viewcount = video.ViewCount,
            like_ids = video.Likes.Select(l => l.UserId).ToList(),
            comment_ids = video.Comments.Select(c => c.UserId).ToList(),
            likes = video.Likes.Select(l => new ResponseLikeDto
            {
                userid = l.UserId,
                videoid = l.VideoId,
                created_at = l.CreatedAt
            }).ToList(),
            comments = video.Comments.Select(c => new ResponseCommentDto
            {
                userid = c.UserId,
                videoid = c.VideoId,
                comment = c.Text,
                created_at = c.CreatedAt
            }).ToList()
        };
    }

    public void DeleteVideo(Guid videoId)
    {
        using (var transaction = _context.Database.BeginTransaction())
        {
            try
            {
                var video = _context.Videos.FirstOrDefault(v => v.VideoId == videoId);

                if (video == null)
                {
                    throw new ArgumentException("Video not found.");
                }

                _context.Videos.Remove(video);
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
    
    public ResponseVideoDto GetRandomVideo()
    {
        try
        {
            var video = _context.Videos
                .Include(v => v.User)
                .Include(v => v.VideoQuest)
                .OrderBy(r => Guid.NewGuid())
                .FirstOrDefault();

            if (video == null)
            {
                throw new ArgumentException("No videos found.");
            }

            return new ResponseVideoDto
            {
                videoid = video.VideoId,
                userid = video.UserId,
                videoquestid = video.VideoQuestId,
                videopath = video.VideoPath,
                caption = video.Caption,
                viewcount = video.ViewCount,
                created_at = video.CreatedAt,
                likes = video.Likes.Select(l => new ResponseLikeDto
                {
                    userid = l.UserId,
                    videoid = l.VideoId,
                    created_at = l.CreatedAt
                }).ToList(),
                comments = video.Comments.Select(c => new ResponseCommentDto
                {
                    userid = c.UserId,
                    videoid = c.VideoId,
                    comment = c.Text,
                    created_at = c.CreatedAt
                }).ToList()
            };
        }
        catch (Exception ex)
        {
            throw new Exception("An error occurred while retrieving a random video.", ex);
        }
    }
    
    public ResponseVideoDto GetRandomVideoFromList(List<Guid> videoIds)
    {
        try
        {
            var videos = _context.Videos
                .Include(v => v.User)
                .Include(v => v.VideoQuest)
                .Where(v => videoIds.Contains(v.VideoId))
                .ToList();

            if (!videos.Any())
            {
                throw new ArgumentException("No videos found in the provided list.");
            }

            var randomVideo = videos
                .OrderBy(r => Guid.NewGuid())
                .FirstOrDefault();

            return new ResponseVideoDto
            {
                videoid = randomVideo.VideoId,
                userid = randomVideo.UserId,
                videoquestid = randomVideo.VideoQuestId,
                videopath = randomVideo.VideoPath,
                caption = randomVideo.Caption,
                viewcount = randomVideo.ViewCount,
                created_at = randomVideo.CreatedAt,
                likes = randomVideo.Likes.Select(l => new ResponseLikeDto
                {
                    userid = l.UserId,
                    videoid = l.VideoId,
                    created_at = l.CreatedAt
                }).ToList(),
                comments = randomVideo.Comments.Select(c => new ResponseCommentDto
                {
                    userid = c.UserId,
                    videoid = c.VideoId,
                    comment = c.Text,
                    created_at = c.CreatedAt
                }).ToList()
            };
        }
        catch (Exception ex)
        {
            throw new Exception("An error occurred while retrieving a random video from the list.", ex);
        }
    }
}
