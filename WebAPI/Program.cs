using ESOF.WebApp.DBLayer.Context;
using ESOF.WebApp.DBLayer.Entities;
using Helpers;
using Microsoft.EntityFrameworkCore;
using Microsoft.OpenApi.Models;
using Swashbuckle.AspNetCore.SwaggerGen;

var builder = WebApplication.CreateBuilder(args);

// Aumentar o tamanho máximo permitido para uploads no Kestrel
builder.WebHost.ConfigureKestrel(options =>
{
    options.Limits.MaxRequestBodySize = 1073741824; // 1 GB
});

// Add services to the container.
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.OperationFilter<AddMultipartFormDataOperationFilter>();
});

// Registrar o ApplicationDbContext com a configuração do PostgreSQL
builder.Services.AddDbContext<ApplicationDbContext>(options =>
{
    var db = EnvFileHelper.GetString("POSTGRES_DB");
    var user = EnvFileHelper.GetString("POSTGRES_USER");
    var password = EnvFileHelper.GetString("POSTGRES_PASSWORD");
    var port = EnvFileHelper.GetString("POSTGRES_PORT");
    var host = EnvFileHelper.GetString("POSTGRES_HOST");

    var connectionString = $"Host={host};Port={port};Database={db};Username={user};Password={password}";
    options.UseNpgsql(connectionString);
});

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

// Adicionar endpoints para GameReplay
app.MapGet("/gamereplays", () =>
    {
        var db = new ApplicationDbContext();
        return db.GameReplays;
    })
    .WithName("GetGameReplays")
    .WithOpenApi();

// Definir o endpoint POST para game replays
app.MapPost("/gamereplays", async (HttpRequest request, ApplicationDbContext db) =>
{
    try
    {
        Console.WriteLine($"Request Content-Type: {request.ContentType}");

        if (request.ContentType == null || !request.ContentType.StartsWith("multipart/form-data"))
        {
            Console.WriteLine("Incorrect Content-Type");
            return Results.BadRequest("Incorrect Content-Type. Expected multipart/form-data.");
        }

        var form = await request.ReadFormAsync();
        var title = form["Title"].ToString();
        var videoFile = form.Files["VideoFile"];

        Console.WriteLine($"Received title: {title}");
        Console.WriteLine($"Received video file: {videoFile?.FileName}, size: {videoFile?.Length}");

        if (videoFile == null || string.IsNullOrEmpty(title))
        {
            Console.WriteLine("Title and video file are required.");
            return Results.BadRequest("Title and video file are required.");
        }

        using var memoryStream = new MemoryStream();
        await videoFile.CopyToAsync(memoryStream);
        var videoData = memoryStream.ToArray();

        Console.WriteLine($"Video data length: {videoData.Length}");

        if (videoData.Length == 0)
        {
            Console.WriteLine("Video data is required.");
            return Results.BadRequest("Video data is required.");
        }

        if (videoData.Length > 1073741824)
        {
            Console.WriteLine("Video file is too large. Maximum size allowed is 1 GB.");
            return Results.BadRequest("Video file is too large. Maximum size allowed is 1 GB.");
        }
        
        // Upload to a file path (Uploads)
        var filePath = Path.Combine("Uploads", videoFile.FileName);
        //Directory.CreateDirectory("Uploads");
        //await using (var fileStream = new FileStream(filePath, FileMode.Create))
        //{
        //    await fileStream.WriteAsync(videoData, 0, videoData.Length);
        //}

        var gameReplay = new GameReplay
        {
            Title = title,
            UploadDate = DateTime.UtcNow,
            VideoData = videoData,
            FilePath = filePath
        };

        db.GameReplays.Add(gameReplay);
        await db.SaveChangesAsync();

        return Results.Created($"/gamereplays/{gameReplay.Id}", gameReplay);
    }
    catch (Exception ex)
    {
        Console.WriteLine($"Exception during upload processing: {ex.Message}");
        return Results.Problem("An error occurred while processing the upload.");
    }
})
.WithName("CreateGameReplay")
.WithOpenApi();

app.Run();

record WeatherForecast(DateOnly Date, int TemperatureC, string? Summary)
{
    public int TemperatureF => 32 + (int)(TemperatureC / 0.5556);
}


// Classe para adicionar o filtro de operação para multipart/form-data no Swagger
public class AddMultipartFormDataOperationFilter : IOperationFilter
{
    public void Apply(OpenApiOperation operation, OperationFilterContext context)
    {
        if (operation.OperationId == "CreateGameReplay")
        {
            operation.Parameters.Clear();
            operation.RequestBody = new OpenApiRequestBody
            {
                Content =
                {
                    ["multipart/form-data"] = new OpenApiMediaType
                    {
                        Schema = new OpenApiSchema
                        {
                            Type = "object",
                            Properties =
                            {
                                ["Title"] = new OpenApiSchema
                                {
                                    Type = "string"
                                },
                                ["VideoFile"] = new OpenApiSchema
                                {
                                    Type = "string",
                                    Format = "binary"
                                }
                            },
                            Required = new HashSet<string> { "Title", "VideoFile" }
                        }
                    }
                }
            };
        }
    }
}