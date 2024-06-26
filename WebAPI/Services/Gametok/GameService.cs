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

public class GameService
{
    private readonly ApplicationDbContext _context;

    public GameService(ApplicationDbContext context)
    {
        _context = context;
    }

    public List<ResponseGameDto> GetGames()
    {
        try
        {
            return _context.Games
                .Include(g => g.Challenges)
                .Select(game => new ResponseGameDto
                {
                    gameid = game.GameId,
                    name = game.Name,
                    console = game.Console,
                    challenge_ids = game.Challenges.Select(c => c.VideoQuestId).ToList(),
                    challenges = game.Challenges.Select(c => new ResponseVideoQuestDto
                    {
                        videoquestid = c.VideoQuestId,
                        gameid = c.GameId,
                        description = c.Description,
                        created_at = c.CreatedAt,
                    }).ToList()
                }).ToList();
        }
        catch (Exception ex)
        {
            throw new Exception("An error occurred while retrieving games.", ex);
        }
    }

    public ResponseGameDto GetGameById(Guid gameId)
    {
        var game = _context.Games
            .Include(g => g.Challenges)
            .FirstOrDefault(g => g.GameId == gameId);

        if (game == null)
        {
            throw new ArgumentException("Game not found.");
        }

        return new ResponseGameDto
        {
            gameid = game.GameId,
            name = game.Name,
            console = game.Console,
            challenge_ids = game.Challenges.Select(c => c.VideoQuestId).ToList(),
            challenges = game.Challenges.Select(c => new ResponseVideoQuestDto
            {
                videoquestid = c.VideoQuestId,
                gameid = c.GameId,
                description = c.Description,
                created_at = c.CreatedAt,
            }).ToList()
        };
    }

    public ResponseGameDto CreateGame(CreateGameDto createGameDto)
    {
        try
        {
            var game = new Game
            {
                GameId = Guid.NewGuid(),
                Name = createGameDto.name,
                Console = createGameDto.console
            };

            _context.Games.Add(game);
            _context.SaveChanges();

            return new ResponseGameDto
            {
                gameid = game.GameId,
                name = game.Name,
                console = game.Console,
                challenge_ids = new List<Guid>(),
                challenges = new List<ResponseVideoQuestDto>()
            };
        }
        catch (DbUpdateException ex)
        {
            throw new Exception("An error occurred while creating the game.", ex);
        }
    }

    public ResponseGameDto UpdateGame(Guid gameId, UpdateGameDto updateGameDto)
    {
        var game = _context.Games.FirstOrDefault(g => g.GameId == gameId);

        if (game == null)
        {
            throw new ArgumentException("Game not found.");
        }

        game.Name = updateGameDto.name ?? game.Name;
        game.Console = updateGameDto.console ?? game.Console;

        _context.SaveChanges();

        return new ResponseGameDto
        {
            gameid = game.GameId,
            name = game.Name,
            console = game.Console,
            challenge_ids = game.Challenges.Select(c => c.VideoQuestId).ToList(),
            challenges = game.Challenges.Select(c => new ResponseVideoQuestDto
            {
                videoquestid = c.VideoQuestId,
                gameid = c.GameId,
                description = c.Description,
                created_at = c.CreatedAt,
            }).ToList()
        };
    }

    public void DeleteGame(Guid gameId)
    {
        using (var transaction = _context.Database.BeginTransaction())
        {
            try
            {
                var game = _context.Games.FirstOrDefault(g => g.GameId == gameId);

                if (game == null)
                {
                    throw new ArgumentException("Game not found.");
                }

                _context.Games.Remove(game);
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
