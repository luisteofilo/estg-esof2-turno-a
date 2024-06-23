using ESOF.WebApp.DBLayer.Context;
using ESOF.WebApp.DBLayer.Entities;


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



app.MapGet("/users/emails", () =>
    {
        var db = new ApplicationDbContext();
        return db.Users.Select(u => u.Email);
    })
    .WithName("GetUsersNames")
    .WithOpenApi();


//GET
app.MapGet("/games", () =>
    {
        var db = new ApplicationDbContext();
        return db.Games.Select(u => u);
    })
    .WithName("GetGame")
    .WithOpenApi();

app.MapGet("/users", () =>
    {
        var db = new ApplicationDbContext();
        return db.Users.Select(u => u);
    })
    .WithName("GetUsers")
    .WithOpenApi();

app.MapGet("/posts", () =>
    {
        var db = new ApplicationDbContext();
        return db.Posts.Select(u => u);
    })
    .WithName("GetPost")
    .WithOpenApi();

app.MapGet("/comments", () =>
    {
        var db = new ApplicationDbContext();
        return db.Comments.Select(u => u);
    })
    .WithName("GetComment")
    .WithOpenApi();

app.MapGet("/commentLikes", () =>
    {
        var db = new ApplicationDbContext();
        return db.CommentLikes.Select(u => u);
    })
    .WithName("GetCommentLikes")
    .WithOpenApi();

app.MapGet("/postLikes", () =>
    {
        var db = new ApplicationDbContext();
        return db.PostLikes.Select(u => u);
    })
    .WithName("GetPostLikes")
    .WithOpenApi();


app.MapGet("/games/title", () =>
    {
        var db = new ApplicationDbContext();
        return db.Games.Select(u => u.title);
    })
    .WithName("GetGameNames")
    .WithOpenApi();






//DELETE

app.MapDelete("/games/{title}", (string title) =>
    {
        using var db = new ApplicationDbContext();

        // Find the game by title
        var gameToDelete = db.Games.FirstOrDefault(g => g.title == title);

        if (gameToDelete == null)
        {
            return Results.NotFound($"Game with title '{title}' not found.");
        }

        // Remove the game from the context
        db.Games.Remove(gameToDelete);
        db.SaveChanges();

        return Results.Ok($"Game '{title}' successfully deleted.");
    })
    .WithName("DeleteGame")
    .WithOpenApi();



app.MapDelete("/posts/{title}", (string title) =>
    {
        using var db = new ApplicationDbContext();

        // Find the game by title
        var postToDelete = db.Posts.FirstOrDefault(p => p.title == title);

        if (postToDelete == null)
        {
            return Results.NotFound($"Post with title '{title}' not found.");
        }

        // Remove the game from the context
        db.Posts.Remove(postToDelete);
        db.SaveChanges();

        return Results.Ok($"Post '{title}' successfully deleted.");
    })
    .WithName("DeletePost")
    .WithOpenApi();


//DELETE COMMENT BY ID
app.MapDelete("/comments/{CommentId}", (string CommentId) =>
    {
        using var db = new ApplicationDbContext();

        // Convert string CommentId to Guid
        Guid commentIdGuid;
        if (!Guid.TryParse(CommentId, out commentIdGuid))
        {
            return Results.BadRequest($"Invalid CommentId format: '{CommentId}'.");
        }

        // Find the comment by its Guid
        var commentToDelete = db.Comments.FirstOrDefault(c => c.CommentId == commentIdGuid);

        if (commentToDelete == null)
        {
            return Results.NotFound($"Comment with ID '{CommentId}' not found.");
        }

        // Remove the comment from the context
        db.Comments.Remove(commentToDelete);
        db.SaveChanges();

        return Results.Ok($"Comment '{CommentId}' successfully deleted.");
    })
    .WithName("DeleteComment")
    .WithOpenApi();

//DELETE POST BY ID
app.MapDelete("/posts/{PostId}", (string PostId) =>
    {
        using var db = new ApplicationDbContext();
        
        Guid postIdGuid;
        if (!Guid.TryParse(PostId, out postIdGuid))
        {
            return Results.BadRequest($"Invalid PostId format: '{PostId}'.");
        }

        // Find the comment by its Guid
        var postToDelete = db.Posts.FirstOrDefault(p => p.PostId == postIdGuid);

        if (postToDelete == null)
        {
            return Results.NotFound($"Post with ID '{PostId}' not found.");
        }

        // Remove the comment from the context
        db.Posts.Remove(postToDelete);
        db.SaveChanges();

        return Results.Ok($"Comment '{PostId}' successfully deleted.");
    })
    .WithName("DeletePostId")
    .WithOpenApi();



// UPDATE POST BY ID
app.MapPut("/posts/{PostId}", (string PostId, Post updatedPost) =>
    {
        using var db = new ApplicationDbContext();

        Guid postIdGuid;
        if (!Guid.TryParse(PostId, out postIdGuid))
        {
            return Results.BadRequest($"Invalid PostId format: '{PostId}'.");
        }

        // Find the post by its Guid
        var existingPost = db.Posts.FirstOrDefault(p => p.PostId == postIdGuid);

        if (existingPost == null)
        {
            return Results.NotFound($"Post with ID '{PostId}' not found.");
        }

        // Update the properties of the existing post with the values from the updated post
        existingPost.title = updatedPost.title;
        existingPost.postText = updatedPost.postText;
        existingPost.UserId = updatedPost.UserId;
        existingPost.GameId = updatedPost.GameId;
        

        db.SaveChanges();

        return Results.Ok(existingPost);
    })
    .WithName("UpdatePost")
    .WithOpenApi(); 

// UPDATE POST BY ID
app.MapPut("/comments/{CommentId}", (string CommentId, Comment updatedComment) =>
    {
        using var db = new ApplicationDbContext();

        Guid commentIdGuid;
        if (!Guid.TryParse(CommentId, out commentIdGuid))
        {
            return Results.BadRequest($"Invalid PostId format: '{CommentId}'.");
        }

        // Find the post by its Guid
        var existingComment = db.Comments.FirstOrDefault(p => p.CommentId == commentIdGuid);

        if (existingComment == null)
        {
            return Results.NotFound($"Comment with ID '{CommentId}' not found.");
        }

        // Update the properties of the existing post with the values from the updated post
        existingComment.text = updatedComment.text;
        existingComment.UserId = updatedComment.UserId;
        existingComment.PostId = updatedComment.PostId;
        

        db.SaveChanges();

        return Results.Ok(existingComment);
    })
    .WithName("UpdateComment")
    .WithOpenApi(); 


// Add Like to a Post
app.MapPost("/postLikes", (PostLike newLike) =>
    {
        using var db = new ApplicationDbContext();

        // Check if the like already exists
        var existingLike = db.PostLikes
            .FirstOrDefault(pl => pl.PostId == newLike.PostId && pl.UserId == newLike.UserId);

        if (existingLike != null)
        {
            return Results.Conflict("Like already exists.");
        }

        db.PostLikes.Add(newLike);
        db.SaveChanges();

        return Results.Created($"/postLikes/{newLike.PostId}/{newLike.UserId}", newLike);
    })
    .WithName("AddPostLike")
    .WithOpenApi();

// Remove Like from a Post
app.MapDelete("/postLikes", (Guid postId, Guid userId) =>
    {
        using var db = new ApplicationDbContext();

        var likeToDelete = db.PostLikes
            .FirstOrDefault(pl => pl.PostId == postId && pl.UserId == userId);

        if (likeToDelete == null)
        {
            return Results.NotFound("Like not found.");
        }

        db.PostLikes.Remove(likeToDelete);
        db.SaveChanges();

        return Results.Ok("Like removed.");
    })
    .WithName("RemovePostLike")
    .WithOpenApi();

// Get Likes for a Specific Post
app.MapGet("/postLikes/{postId}", (Guid postId) =>
    {
        using var db = new ApplicationDbContext();

        var likes = db.PostLikes
            .Where(pl => pl.PostId == postId)
            .ToList();

        return Results.Ok(likes);
    })
    .WithName("GetPostLikesSpec")
    .WithOpenApi();

// Get Likes for a Specific comment
app.MapGet("/commentLikes/{commentId}", (Guid commentId) =>
    {
        using var db = new ApplicationDbContext();

        var likes = db.CommentLikes
            .Where(pl => pl.CommentId == commentId)
            .ToList();

        return Results.Ok(likes);
    })
    .WithName("GetCommentLikesSpec")
    .WithOpenApi();

// Remove Like from a comment
app.MapDelete("/commentLikes", (Guid commentId, Guid userId) =>
    {
        using var db = new ApplicationDbContext();

        var likeToDeleteComment = db.CommentLikes
            .FirstOrDefault(pl => pl.CommentId == commentId && pl.UserId == userId);

        if (likeToDeleteComment == null)
        {
            return Results.NotFound("Like not found.");
        }

        db.CommentLikes.Remove(likeToDeleteComment);
        db.SaveChanges();

        return Results.Ok("Like removed.");
    })
    .WithName("RemoveCommentLike")
    .WithOpenApi();


// Add Like to a Post
app.MapPost("/commentLikes", (CommentLike newLikeComment) =>
    {
        using var db = new ApplicationDbContext();

        // Check if the like already exists
        var existingLike = db.CommentLikes
            .FirstOrDefault(pl => pl.CommentId == newLikeComment.CommentId && pl.UserId == newLikeComment.UserId);

        if (existingLike != null)
        {
            return Results.Conflict("Like already exists.");
        }

        db.CommentLikes.Add(newLikeComment);
        db.SaveChanges();

        return Results.Created($"/postLikes/{newLikeComment.CommentId}/{newLikeComment.UserId}", newLikeComment);
    })
    .WithName("AddCommentLike")
    .WithOpenApi();


app.MapPost("/posts", (Post newPost) =>
    {
        using var db = new ApplicationDbContext();

        // Generate a new GUID for the post
        newPost.PostId = Guid.NewGuid();
       

        db.Posts.Add(newPost);
        db.SaveChanges();

        return Results.Created($"/posts/{newPost.PostId}", newPost);
    })
    .WithName("AddPost")
    .WithOpenApi();

app.MapPost("/comments", (Comment newComment) =>
    {
        using var db = new ApplicationDbContext();

        // Generate a new GUID for the post
        newComment.CommentId = Guid.NewGuid();
       

        db.Comments.Add(newComment);
        db.SaveChanges();

        return Results.Created($"/posts/{newComment.CommentId}", newComment);
    })
    .WithName("AddComment")
    .WithOpenApi();


app.Run();

