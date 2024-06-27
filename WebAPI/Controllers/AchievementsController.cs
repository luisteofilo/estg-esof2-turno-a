using ESOF.WebApp.DBLayer.Context;
using ESOF.WebApp.DBLayer.Entities;
using Helpers.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ESOF.WebApp.WebAPI.Controllers;

[ApiController]
[Route("api/[controller]")]

public class AchievementsController : ControllerBase
{
    [HttpGet]
    public IActionResult GetAchievements()
    {
        var db = new ApplicationDbContext();
        var achievements = db.Achievements
            .Select(g => new
            {
                g.Name,
                g.Description,
                g.RequiredScore
            }).ToList();

        return Ok(achievements);
    }

    [HttpGet("UserAchievements/{userId:guid}")]
    public async Task<ActionResult<PlayerAchievementsViewModel[]>> GetUserAchievements(Guid userId)
    {
        var db = new ApplicationDbContext();

        var userAchievements = await (from pa in db.PlayerAchievements
            join a in db.Achievements on pa.AchievementId equals a.IdAchievement
            where pa.UserId == userId
            select new PlayerAchievementsViewModel
            {
                Name = a.Name,
                Description = a.Description,
                Unlocked = pa.Unlocked,
                AchievementId = pa.AchievementId
            }).ToArrayAsync();

        if (userAchievements == null || userAchievements.Length == 0)
        {
            return NotFound("No achievements found for this user.");
        }

        return Ok(userAchievements);
    }
    
    [HttpPost("SaveScore/{userId:Guid}/{score:long}")]
    public async Task<ActionResult> SaveScore(Guid userId, long score)
    {
        var db = new ApplicationDbContext();

        var scoreEntry = new TestUserScore
        {
            UserId = userId,
            Score = score
        };

        db.TestUserScores.Add(scoreEntry);
        await db.SaveChangesAsync();

        return Ok(new { message = "Score saved successfully." });
    }
    
    [HttpGet("ScoreAchievements/{score:long}")]
    public async Task<ActionResult<AchievementsViewModel[]>> GetScoreAchievements(long score)
    {
        var db = new ApplicationDbContext();

        var achievements = await (from a in db.Achievements
            where a.RequiredScore <= score
            select new AchievementsViewModel
            {
                IdAchievement = a.IdAchievement,
                Name = a.Name,
                Description = a.Description
            }).ToArrayAsync();

        if (achievements == null || achievements.Length == 0)
        {
            return NotFound("No achievements found for this score.");
        }

        return Ok(achievements);
    }
    
    [HttpPost("PlayerAchievements/{userId:Guid}/{achievementId:Guid}")]
    public async Task<ActionResult> InsertPlayerAchievements(Guid userId, Guid achievementId)
    {
        var db = new ApplicationDbContext();

        var existingAchievement = await db.PlayerAchievements
            .AnyAsync(pa => pa.UserId == userId && pa.AchievementId == achievementId);

        if (existingAchievement)
        {
            return BadRequest("Achievement already exists for this user.");
        }

        var newAchievement = new PlayerAchievement
        {
            UserId = userId,
            AchievementId = achievementId,
            Unlocked = DateOnly.FromDateTime(DateTime.Now)
        };

        db.PlayerAchievements.Add(newAchievement);
        await db.SaveChangesAsync();

        return Ok(new { message = "Achievement added successfully." });
    }
    
}