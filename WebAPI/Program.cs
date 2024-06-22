using ESOF.WebApp.DBLayer.Context;
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


/*GET ALL ACHIEVEMENT LIST*/
app.MapGet("/achievements", () =>
    {
        var db = new ApplicationDbContext();
        return db.Achievements.Select(a => new AchievementsViewModel()
        {
            Name = a.Name,
            Description = a.Description
        }).ToArray();
    })
    .WithName("GetAchievements")
    .WithOpenApi();

app.MapGet("/user_achievements/{userId:Guid}", (Guid userId) =>
    {
        var db = new ApplicationDbContext();
        var user_achievements =  (from pa in db.PlayerAchievements
            join a in db.Achievements on pa.AchievementId equals a.IdAchievement
            where pa.UserId == userId
            select new PlayerAchievementsViewModel
            {
                Name = a.Name,
                Description = a.Description,
                Unlocked = pa.Unlocked
            }).ToArray();
        return user_achievements;
    })
    .WithName("GetUserAchievements")
    .WithOpenApi();

app.MapGet("/users", () =>
    {
        var db = new ApplicationDbContext();
        return db.Users.Select(a => new UserViewModel()
        {
            Email = a.Email,
            UserId = a.UserId
        }).ToArray();
    })
    .WithName("GetUsers")
    .WithOpenApi();

app.MapGet("/test", () =>
    {
        var db = new ApplicationDbContext();
        return db.TestUserScores.Select(a => new PlayerAchievementsViewModel()
        {
            Description = a.Score.ToString()
        }).ToArray();
    })
    .WithName("GetTest")
    .WithOpenApi();

app.Run();

record WeatherForecast(DateOnly Date, int TemperatureC, string? Summary)
{
    public int TemperatureF => 32 + (int)(TemperatureC / 0.5556);
}