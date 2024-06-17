using ESOF.WebApp.DBLayer.Entities;
using Microsoft.EntityFrameworkCore;

// ReSharper disable once CheckNamespace
namespace ESOF.WebApp.DBLayer.Context;

public partial class ApplicationDbContext
{
    private void BuildPostLikes(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<PostLike>()
            .HasKey(e => new { e.PostId, e.UserId });

    }
}