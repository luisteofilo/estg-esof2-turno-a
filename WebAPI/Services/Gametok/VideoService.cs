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
using Supabase;

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
                    username = _context.Users.Where(u => u.UserId == video.UserId).Select(u => u.Email).FirstOrDefault(),
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
            Console.WriteLine(ex.Message);
            Console.WriteLine(ex.StackTrace);
            throw;
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
            description = _context.VideoQuests.Find(video.VideoQuestId).Description,
            userid = video.UserId,
            username = _context.Users.Find(video.UserId).Email,
            caption = video.Caption,
            videopath = video.VideoPath,
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

    public async Task<ResponseVideoDto> CreateVideo(CreateVideoDto createVideoDto)
    {
        try
        {
            var url = Environment.GetEnvironmentVariable("SUPABASE_URL");
            var key = Environment.GetEnvironmentVariable("SUPABASE_KEY");
        
            var options = new SupabaseOptions
            {
                AutoConnectRealtime = true
            };
        
            var supabase = new Client(url, key, options);
            await supabase.InitializeAsync();
            
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

            if (createVideoDto.videoFile.Length > 50 * 1024 * 1024) // Max 50 MB
            {
                throw new ArgumentException("Video file exceeds maximum allowed size (50 MB).");
            }

            using var ms = new MemoryStream();
            await createVideoDto.videoFile.CopyToAsync(ms);
            var fileBytes = ms.ToArray();
            
            var storageResponse = await supabase.Storage.From("videos").Upload(fileBytes, $"{Guid.NewGuid()}.mp4");

            if (string.IsNullOrEmpty(storageResponse))
            {
                throw new Exception("Error uploading video to Supabase.");
            }

            var video = new Video
            {
                UserId = createVideoDto.userid,
                VideoQuestId = createVideoDto.challengeid,
                VideoPath = url + "/storage/v1/object/public/" + storageResponse,
                Caption = createVideoDto.caption,
            };

            _context.Videos.Add(video);
            _context.SaveChanges();

            return new ResponseVideoDto
            {
                videoid = video.VideoId,
                videoquestid = video.VideoQuestId,
                description = _context.VideoQuests.Find(video.VideoQuestId).Description,
                userid = video.UserId,
                username = _context.Users.Find(video.UserId).Email,
                caption = video.Caption,
                videopath = video.VideoPath,
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
            description = _context.VideoQuests.Find(video.VideoQuestId).Description,
            userid = video.UserId,
            caption = video.Caption,
            videopath = video.VideoPath,
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
                .Include(v => v.Likes)
                .Include(v => v.Comments)
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
                username = _context.Users.Find(video.UserId).Email,
                videoquestid = video.VideoQuestId,
                description = _context.VideoQuests.Find(video.VideoQuestId).Description,
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
}
