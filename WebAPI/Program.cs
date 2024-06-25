using ESOF.WebApp.DBLayer.Context;
using ESOF.WebApp.DBLayer.Entities;
using Helpers.Models;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

var summaries = new[]
{
    "Freezing", "Bracing", "Chilly", "Cool", "Mild", "Warm", "Balmy", "Hot", "Sweltering", "Scorching"
};

app.MapGet("/weatherforecast", () =>
    {
        var forecast = Enumerable.Range(1, 5).Select(index =>
                new WeatherForecast
                (
                    DateOnly.FromDateTime(DateTime.Now.AddDays(index)),
                    Random.Shared.Next(-20, 55),
                    summaries[Random.Shared.Next(summaries.Length)]
                ))
            .ToArray();
        return forecast;
    })
    .WithName("GetWeatherForecast")
    .WithOpenApi();

app.MapGet("/users/emails", () =>
    {
        var db = new ApplicationDbContext();
        return db.Users.Select(u => u.Email);
    })
    .WithName("GetUsersNames")
    .WithOpenApi();

//Games

//Get

app.MapGet("/games", () =>
    {
        var db = new ApplicationDbContext();
        return db.Games.Select(g => new GameViewModel()
        {
            GameID = g.game_id,
            GameName = g.name
        }).ToArray();
    })
    .WithName("GetGames")
    .WithOpenApi();

//speedRuns

//Get
app.MapGet("/speedRuns/moderators", () =>
    {
        var db = new ApplicationDbContext();
        return db.SpeedrunModerators.Select(m => new SpeedrunModeratorViewModel(
        ){
            ModeratorID = m.moderatorID,
            UserID = m.userID,
            GameID = m.gameID,
            RoleGivenDate = m.roleGivenDate
        }).ToArray();    
    })
    .WithName("getSpeedRunModerators")
    .WithOpenApi();

//get runs by game id and category id

app.MapGet("/speedRuns/runs/{categoryID}", (Guid categoryID) =>
{
    var db = new ApplicationDbContext();

    var category = db.SpeedrunCategories.Find(categoryID);
    if (category == null)
    {
        return Results.NotFound();
    }

    var game = db.Games.Find(category.gameID);
    string gameName = game != null ? game.name : "Unknown Game";

    var runs = db.SpeedrunRuns.Where(r => r.categoryID == categoryID).ToList();

    var runViewModels = new List<SpeedrunRunViewModel>();

    foreach (var run in runs)
    {
        var player = db.Users.Find(run.playerID);
        string playerName = player != null ? player.Email : "Unknown Player";

        var runViewModel = new SpeedrunRunViewModel()
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
            // verificar se verifierID é null e caso seja atribuir empty guid
            verifierID = run.verifierID == null ? Guid.Empty : run.verifierID,
            VideoLink = run.videoLink
        };

        runViewModels.Add(runViewModel);
    }

    return Results.Ok(runViewModels.ToArray());

})
.WithName("GetSpeedRunRunsByCategory")
.WithOpenApi();


app.MapGet("/speedRuns/runs", () =>
    {
        var db = new ApplicationDbContext();
        return db.SpeedrunRuns.Select(r => new SpeedrunRunViewModel(
        ){
            RunID = r.runID,
            PlayerID = r.playerID,
            CategoryID = r.categoryID,
            RunTime = r.runTime,
            SubmissionDate = r.SubmissionDate,
            Verified = r.verified,
            verifierID = r.verifierID,
            VideoLink = r.videoLink
            
        }).ToArray();
    })
    .WithName("GetSpeedRunRuns")
    .WithOpenApi();

app.MapGet("/speedRuns/categories", () =>
    {
        var db = new ApplicationDbContext();
        return db.SpeedrunCategories.Select(c => new SpeedrunCategoryViewModel(
        )
        {
            CategoryID = c.categoryID,
            GameID = c.gameID,
            CreationDate = c.creationDate,
            CategoryName = c.categoryName,
            CategoryDescription = c.categoryDescription,
            CategoryRules = c.categoryRules
        }).ToArray();
    })
    .WithName("GetSpeedRunCategories")
    .WithOpenApi();

app.MapGet("/speedRuns/categories/{gameID}", (Guid gameID) =>
    {
        var db = new ApplicationDbContext();
        return db.SpeedrunCategories.Where(c => c.gameID == gameID).Select(c => new SpeedrunCategoryViewModel()
        {
            CategoryID = c.categoryID,
            GameID = c.gameID,
            CreationDate = c.creationDate,
            CategoryName = c.categoryName,
            CategoryDescription = c.categoryDescription,
            CategoryRules = c.categoryRules
        }).ToArray();
    })
    .WithName("GetSpeedRunCategoriesByGame")
    .WithOpenApi();

//Post

app.MapPost("/speedRuns/moderators", (SpeedrunModeratorViewModel moderator) =>
    {
        var db = new ApplicationDbContext();
        db.SpeedrunModerators.Add(new SpeedrunModerator()
        {
            moderatorID = moderator.ModeratorID,
            userID = moderator.UserID,
            gameID = moderator.GameID,
            roleGivenDate = moderator.RoleGivenDate
        });
        db.SaveChanges();
        return moderator;
    })
    .WithName("PostSpeedRunModerators")
    .WithOpenApi();

app.MapPost("/speedRuns/runs", (SpeedrunRunViewModel run) =>
{
    var db = new ApplicationDbContext();
    db.SpeedrunRuns.Add(new SpeedrunRun()
    {
        runID = run.RunID,
        playerID = run.PlayerID,
        categoryID = run.CategoryID,
        runTime = run.RunTime,
        SubmissionDate = run.SubmissionDate,
        verified = run.Verified,
        //verifierID = run.verifierID,
        videoLink = run.VideoLink
    });
    db.SaveChanges();
    return run;
})
    .WithName("PostSpeedRunRuns")
    .WithOpenApi();


app.MapPost("/speedRuns/categories", (SpeedrunCategoryViewModel category) =>
{
    var db = new ApplicationDbContext();
    db.SpeedrunCategories.Add(new SpeedrunCategory()
    {
        categoryID = category.CategoryID,
        gameID = category.GameID,
        creationDate = category.CreationDate,
        categoryName = category.CategoryName,
        categoryDescription = category.CategoryDescription,
        categoryRules = category.CategoryRules
    });
    db.SaveChanges();
    return category;
})
    .WithName("PostSpeedRunCategories")
    .WithOpenApi();

//Put

app.MapPut("/speedRuns/moderators", (SpeedrunModeratorViewModel moderator) =>
    {
        var db = new ApplicationDbContext();
        var mod = db.SpeedrunModerators.Find(moderator.ModeratorID);
        if (mod != null)
        {
            mod.userID = moderator.UserID;
            mod.gameID = moderator.GameID;
            mod.roleGivenDate = moderator.RoleGivenDate;
            db.SaveChanges();
        }
        return moderator;
    })
    .WithName("PutSpeedRunModerators")
    .WithOpenApi();

app.MapPut("/speedRuns/runs", (SpeedrunRunViewModel run) =>
    {
        var db = new ApplicationDbContext();
        var runEntity = db.SpeedrunRuns.Find(run.RunID);
        if (runEntity != null)
        {
            runEntity.playerID = run.PlayerID;
            runEntity.categoryID = run.CategoryID;
            runEntity.runTime = run.RunTime;
            runEntity.SubmissionDate = run.SubmissionDate;
            runEntity.verified = run.Verified;
            //runEntity.verifierID = run.verifierID;
            runEntity.videoLink = run.VideoLink;
            db.SaveChanges();
        }
        return run;
    })
    .WithName("PutSpeedRunRuns")
    .WithOpenApi();

app.MapPut("/speedRuns/categories", (SpeedrunCategoryViewModel category) =>
    {
        var db = new ApplicationDbContext();
        var cat = db.SpeedrunCategories.Find(category.CategoryID);
        if (cat != null)
        {
            cat.gameID = category.GameID;
            cat.creationDate = category.CreationDate;
            cat.categoryName = category.CategoryName;
            cat.categoryDescription = category.CategoryDescription;
            cat.categoryRules = category.CategoryRules;
            db.SaveChanges();
        }

        return category;
    })
    .WithName("PutSpeedRunCategories")
    .WithOpenApi();
    



app.Run();

record WeatherForecast(DateOnly Date, int TemperatureC, string? Summary)
{
    public int TemperatureF => 32 + (int)(TemperatureC / 0.5556);
}