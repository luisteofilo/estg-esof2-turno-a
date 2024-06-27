using ESOF.WebApp.DBLayer.Entities;
using Microsoft.EntityFrameworkCore;

namespace ESOF.WebApp.DBLayer.Context;

public partial class ApplicationDbContext
{
    private void BuildTestChallengeUser(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<TestChallengeUser>()
            .HasKey(c => new { c.UserId, c.TestChallengeId });

    }
}
