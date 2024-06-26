using ESOF.WebApp.DBLayer.Context;
using ESOF.WebApp.DBLayer.Entities;

namespace ESOF.WebApp.WebAPI.Services;

using Helpers.Models;
using System;
using System.Collections.Generic;
using System.Linq;



public class SpeedRunService (ApplicationDbContext db)
{

    public IEnumerable<GameViewModel> GetGames()
    {
        return db.Games.Select(g => new GameViewModel()
        {
            GameID = g.game_id,
            GameName = g.name
        }).ToArray();
    }

    public IEnumerable<SpeedrunModeratorViewModel> GetSpeedRunModerators()
    {
        return db.SpeedrunModerators.Select(m => new SpeedrunModeratorViewModel()
        {
            ModeratorID = m.moderatorID,
            UserID = m.userID,
            GameID = m.gameID,
            RoleGivenDate = m.roleGivenDate
        }).ToArray();
    }

    public IEnumerable<SpeedrunRunViewModel> GetRunsByCategory(Guid categoryID)
    {
        var category = db.SpeedrunCategories.Find(categoryID);
        if (category == null) return null;

        var game = db.Games.Find(category.gameID);
        string gameName = game != null ? game.name : "Unknown Game";

        var runs = db.SpeedrunRuns.Where(r => r.categoryID == categoryID).ToList();

        return runs.Select(run =>
        {
            var player = db.Users.Find(run.playerID);
            string playerName = player != null ? player.Email : "Unknown Player";

            return new SpeedrunRunViewModel()
            {
                RunID = run.runID,
                PlayerID = run.playerID,
                PlayerName = playerName,
                CategoryName = category.categoryName,
                GameName = gameName,
                CategoryID = run.categoryID,
                RunTime = run.runTime,
                SubmissionDate = run.SubmissionDate,
                Verified = run.verified,
                verifierID = run.verifierID ?? Guid.Empty,
                VideoLink = run.videoLink
            };
        }).ToList();
    }

    public IEnumerable<SpeedrunRunViewModel> GetSpeedRunRuns()
    {
        return db.SpeedrunRuns.Select(r => new SpeedrunRunViewModel()
        {
            RunID = r.runID,
            PlayerID = r.playerID,
            CategoryID = r.categoryID,
            RunTime = r.runTime,
            SubmissionDate = r.SubmissionDate,
            Verified = r.verified,
            verifierID = r.verifierID,
            VideoLink = r.videoLink
        }).ToArray();
    }

    public IEnumerable<SpeedrunCategoryViewModel> GetSpeedRunCategories()
    {
        return db.SpeedrunCategories.Select(c => new SpeedrunCategoryViewModel()
        {
            CategoryID = c.categoryID,
            GameID = c.gameID,
            CreationDate = c.creationDate,
            CategoryName = c.categoryName,
            CategoryDescription = c.categoryDescription,
            CategoryRules = c.categoryRules
        }).ToArray();
    }

    public IEnumerable<SpeedrunCategoryViewModel> GetCategoriesByGame(Guid gameID)
    {
        return db.SpeedrunCategories.Where(c => c.gameID == gameID).Select(c => new SpeedrunCategoryViewModel()
        {
            CategoryID = c.categoryID,
            GameID = c.gameID,
            CreationDate = c.creationDate,
            CategoryName = c.categoryName,
            CategoryDescription = c.categoryDescription,
            CategoryRules = c.categoryRules
        }).ToArray();
    }

    public void AddSpeedrunModerator(SpeedrunModeratorViewModel moderator)
    {
        var entity = new SpeedrunModerator()
        {
            moderatorID = moderator.ModeratorID,
            userID = moderator.UserID,
            gameID = moderator.GameID,
            roleGivenDate = moderator.RoleGivenDate
        };
        db.SpeedrunModerators.Add(entity);
        db.SaveChanges();
    }

    public void AddSpeedrunRun(Guid playerID, Guid categoryID, int runTime, string videoLink)
    {
        var speedrunRun = new SpeedrunRun()
        {
            playerID = playerID,
            categoryID = categoryID,
            runTime = runTime,
            SubmissionDate = DateTimeOffset.Now.UtcDateTime,
            videoLink = videoLink
        };
        db.SpeedrunRuns.Add(speedrunRun);
        db.SaveChanges();
    }

    public void AddSpeedrunCategory(SpeedrunCategoryViewModel category)
    {
        var entity = new SpeedrunCategory()
        {
            categoryID = category.CategoryID,
            gameID = category.GameID,
            creationDate = category.CreationDate,
            categoryName = category.CategoryName,
            categoryDescription = category.CategoryDescription,
            categoryRules = category.CategoryRules
        };
        db.SpeedrunCategories.Add(entity);
        db.SaveChanges();
    }

    public void UpdateSpeedrunModerator(SpeedrunModeratorViewModel moderator)
    {
        var entity = db.SpeedrunModerators.Find(moderator.ModeratorID);
        if (entity != null)
        {
            entity.userID = moderator.UserID;
            entity.gameID = moderator.GameID;
            entity.roleGivenDate = moderator.RoleGivenDate;
            db.SaveChanges();
        }
    }

    public void UpdateSpeedrunRun(SpeedrunRunViewModel run)
    {
        var entity = db.SpeedrunRuns.Find(run.RunID);
        if (entity != null)
        {
            entity.playerID = run.PlayerID;
            entity.categoryID = run.CategoryID;
            entity.runTime = run.RunTime;
            entity.SubmissionDate = run.SubmissionDate;
            entity.verified = run.Verified;
            entity.videoLink = run.VideoLink;
            db.SaveChanges();
        }
    }

    public void UpdateSpeedrunCategory(SpeedrunCategoryViewModel category)
    {
        var entity = db.SpeedrunCategories.Find(category.CategoryID);
        if (entity != null)
        {
            entity.gameID = category.GameID;
            entity.creationDate = category.CreationDate;
            entity.categoryName = category.CategoryName;
            entity.categoryDescription = category.CategoryDescription;
            entity.categoryRules = category.CategoryRules;
            db.SaveChanges();
        }
    }
}

