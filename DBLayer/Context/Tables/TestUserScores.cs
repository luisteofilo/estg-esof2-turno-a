using ESOF.WebApp.DBLayer.Entities;
using Microsoft.EntityFrameworkCore;

namespace ESOF.WebApp.DBLayer.Context;

public partial class ApplicationDbContext
{
    private void BuildTestUserScores(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<TestUserScore>()
            .HasOne(t => t.User)
            .WithMany(u => u.TestUserScores)
            .HasForeignKey(t => t.UserId);
        
        modelBuilder.Entity<TestUserScore>()
            .Property(t => t.ScoreId)
            .HasDefaultValueSql("gen_random_uuid()");

    }
}