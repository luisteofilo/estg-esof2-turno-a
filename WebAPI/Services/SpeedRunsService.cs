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
            GameID = g.GameId,
            GameName = g.Name
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
    
    // retornar os jogos que um utilizador é moderador
    public IEnumerable<GameViewModel> GetModeratorGamesByUser(Guid userID)
    {
        return db.SpeedrunModerators.Where(m => m.userID == userID).Select(m => new GameViewModel()
        {
            GameID = m.gameID,
            GameName = db.Games.FirstOrDefault(g => g.GameId == m.gameID) != null ? db.Games.FirstOrDefault(g => g.GameId == m.gameID).Name : "Unknown Game"
        }).ToArray();
    }
    

    public IEnumerable<SpeedrunRunViewModel> GetRunsByCategory(Guid categoryID)
    {
        var category = db.SpeedrunCategories.Find(categoryID);
        if (category == null) return null;
        Console.WriteLine(category.gameID);

        var game = db.Games.Find(category.gameID);
        string gameName = game != null ? game.Name : "Unknown Game";
        Console.WriteLine(game.Name);

        var runs = db.SpeedrunRuns.Where(r => r.categoryID == categoryID).ToList();
            
        Console.WriteLine(runs.Count);
        
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
    
    // retornar as runs de um jogador com o nome da categoria e do jogo e do jogador e retorn o rank dessa run na respetiva categoria
    public IEnumerable<SpeedrunRunViewModel> GetRunsByPlayer(Guid playerID)
    {
        var runs = db.SpeedrunRuns.Where(r => r.playerID == playerID).ToList();
        return runs.Select(run =>
        {
            var player = db.Users.Find(run.playerID);
            var category = db.SpeedrunCategories.Find(run.categoryID);
            var game = db.Games.Find(category.gameID);
            string playerName = player != null ? player.Email : "Unknown Player";
            string categoryName = category != null ? category.categoryName : "Unknown Category";
            string gameName = game != null ? game.Name : "Unknown Game";

            var rank = db.SpeedrunRuns.Where(r => r.categoryID == run.categoryID && r.runTime < run.runTime).Count() + 1;

            return new SpeedrunRunViewModel()
            {
                RunID = run.runID,
                PlayerID = run.playerID,
                PlayerName = playerName,
                CategoryName = categoryName,
                GameName = gameName,
                CategoryID = run.categoryID,
                RunTime = run.runTime,
                SubmissionDate = run.SubmissionDate,
                Verified = run.verified,
                VideoLink = run.videoLink,
                Rank = rank
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
    
    // retornar as runs que ainda não foram verificadas com o nome do jogador, categoria e jogo e IDS
    
    public IEnumerable<SpeedrunRunViewModel> GetSpeedRunRunsToVerify()
    {
        var runs = db.SpeedrunRuns.Where(r => r.verifier == null).ToList();
        return runs.Select(run =>
        {
            var player = db.Users.Find(run.playerID);
            var category = db.SpeedrunCategories.Find(run.categoryID);
            var game = db.Games.Find(category.gameID);
            string playerName = player != null ? player.Email : "Unknown Player";
            string categoryName = category != null ? category.categoryName : "Unknown Category";
            string gameName = game != null ? game.Name : "Unknown Game";

            return new SpeedrunRunViewModel()
            {
                RunID = run.runID,
                PlayerID = run.playerID,
                PlayerName = playerName,
                CategoryName = categoryName,
                GameName = gameName,
                GameID = category.gameID != null ? category.gameID : Guid.Empty,
                CategoryID = run.categoryID,
                RunTime = run.runTime,
                SubmissionDate = run.SubmissionDate,
                Verified = run.verified,
                verifierID = run.verifierID ?? Guid.Empty,
                VideoLink = run.videoLink
            };
        }).ToList();
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
    
    // categoria por id
    public SpeedrunCategoryViewModel GetCategory(Guid categoryID)
    {
        var category = db.SpeedrunCategories.Find(categoryID);
        if (category == null) return null;
        return new SpeedrunCategoryViewModel()
        {
            CategoryID = category.categoryID,
            GameID = category.gameID,
            CreationDate = category.creationDate,
            CategoryName = category.categoryName,
            CategoryDescription = category.categoryDescription,
            CategoryRules = category.categoryRules
        };
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
    
    // verificar run e adicionar o ID do verificador
    public void VerifyRun(Guid runID, Guid verifierID, bool verify)
    {
        var run = db.SpeedrunRuns.Find(runID);
        var category = db.SpeedrunCategories.Find(run.categoryID);
        if (run != null && category != null)
        {
            
            var verifier = db.SpeedrunModerators.Where(m => m.userID == verifierID && m.gameID == category.gameID).FirstOrDefault();
            if (verifier != null)
            {
                run.verified = verify;
                run.verifierID = verifier.moderatorID;
                db.SaveChanges();
            }
        }
        else
        {
           
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

