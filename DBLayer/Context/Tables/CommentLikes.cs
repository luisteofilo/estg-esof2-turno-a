using ESOF.WebApp.DBLayer.Entities;
using Microsoft.EntityFrameworkCore;

// ReSharper disable once CheckNamespace
namespace ESOF.WebApp.DBLayer.Context;

public partial class ApplicationDbContext
{
    private void BuildCommentLikes(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<CommentLike>()
            .HasKey(e => new { e.CommentId, e.UserId });

    }
}