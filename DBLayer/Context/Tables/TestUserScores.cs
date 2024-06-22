using ESOF.WebApp.DBLayer.Entities;
using Microsoft.EntityFrameworkCore;

namespace ESOF.WebApp.DBLayer.Context;

public partial class ApplicationDbContext
{
    private void BuildTestUserScores(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<TestUserScore>()
            .HasKey(t => t.UserId);
        
        modelBuilder.Entity<TestUserScore>()
            .HasOne(t => t.User)
            .WithMany(u => u.TestUserScores)
            .HasForeignKey(t => t.UserId);

    }
}