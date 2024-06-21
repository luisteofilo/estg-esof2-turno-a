using ESOF.WebApp.DBLayer.Entities;
using Microsoft.EntityFrameworkCore;

namespace ESOF.WebApp.DBLayer.Context;

public partial class ApplicationDbContext
{
    private void BuildTestUserScores(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<TestUserScore>()
            .HasKey(s => new { s.UserId });

    }
}
