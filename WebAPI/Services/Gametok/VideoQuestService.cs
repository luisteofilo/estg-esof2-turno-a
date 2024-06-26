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

public class VideoQuestService {
    private readonly ApplicationDbContext _context;

    public VideoQuestService(ApplicationDbContext context)
    {
        _context = context;
    }

    public List<ResponseVideoQuestDto> GetVideoQuests(Guid gameId)
    {
        try
        {
            return _context.VideoQuests
                .Include(vq => vq.Game)
                .Include(vq => vq.Videos)
                .Where(vq => vq.GameId == gameId)
                .Select(videoQuest => new ResponseVideoQuestDto
                {
                    videoquestid = videoQuest.VideoQuestId,
                    gameid = videoQuest.GameId,
                    game = _context.Games.Find(videoQuest.GameId).Name,
                    description = videoQuest.Description,
                    created_at = videoQuest.CreatedAt,
                    video_ids = videoQuest.Videos.Select(v => v.VideoId).ToList(),
                }).ToList();
        }
        catch (Exception ex)
        {
            throw new Exception("An error occurred while retrieving video quests.", ex);
        }
    }

    public ResponseVideoQuestDto GetVideoQuestById(Guid videoQuestId)
    {
        var videoQuest = _context.VideoQuests
            .Include(vq => vq.Game)
            .Include(vq => vq.Videos)
            .FirstOrDefault(vq => vq.VideoQuestId == videoQuestId);

        if (videoQuest == null)
        {
            throw new ArgumentException("VideoQuest not found.");
        }

        return new ResponseVideoQuestDto
        {
            videoquestid = videoQuest.VideoQuestId,
            gameid = videoQuest.GameId,
            game = _context.Games.Find(videoQuest.GameId).Name,
            description = videoQuest.Description,
            created_at = videoQuest.CreatedAt,
            video_ids = videoQuest.Videos.Select(v => v.VideoId).ToList(),
        };
    }

    public ResponseVideoQuestDto CreateVideoQuest(CreateVideoQuestDto createVideoQuestDto)
    {
        try
        {
            var game = _context.Games.Find(createVideoQuestDto.gameid);
            if (game == null)
            {
                throw new ArgumentException("Game not found.");
            }

            var videoQuest = new VideoQuest
            {
                VideoQuestId = Guid.NewGuid(),
                GameId = createVideoQuestDto.gameid,
                Description = createVideoQuestDto.description,
                CreatedAt = DateTime.UtcNow
            };

            _context.VideoQuests.Add(videoQuest);
            _context.SaveChanges();

            return new ResponseVideoQuestDto
            {
                videoquestid = videoQuest.VideoQuestId,
                gameid = videoQuest.GameId,
                description = videoQuest.Description,
                created_at = videoQuest.CreatedAt,
                video_ids = new List<Guid>()
            };
        }
        catch (DbUpdateException ex)
        {
            throw new Exception("An error occurred while creating the video quest.", ex);
        }
    }

    public ResponseVideoQuestDto UpdateVideoQuest(Guid videoQuestId, UpdateVideoQuestDto updateVideoQuestDto)
    {
        var videoQuest = _context.VideoQuests.FirstOrDefault(vq => vq.VideoQuestId == videoQuestId);

        if (videoQuest == null)
        {
            throw new ArgumentException("VideoQuest not found.");
        }

        videoQuest.Description = updateVideoQuestDto.description ?? videoQuest.Description;

        _context.SaveChanges();

        return new ResponseVideoQuestDto
        {
            videoquestid = videoQuest.VideoQuestId,
            gameid = videoQuest.GameId,
            game = _context.Games.Find(videoQuest.GameId).Name,
            description = videoQuest.Description,
            created_at = videoQuest.CreatedAt,
            video_ids = videoQuest.Videos.Select(v => v.VideoId).ToList()
        };
    }

    public void DeleteVideoQuest(Guid videoQuestId)
    {
        using (var transaction = _context.Database.BeginTransaction())
        {
            try
            {
                var videoQuest = _context.VideoQuests.FirstOrDefault(vq => vq.VideoQuestId == videoQuestId);

                if (videoQuest == null)
                {
                    throw new ArgumentException("VideoQuest not found.");
                }

                _context.VideoQuests.Remove(videoQuest);
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
