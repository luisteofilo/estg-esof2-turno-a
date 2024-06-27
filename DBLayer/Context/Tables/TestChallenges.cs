using ESOF.WebApp.DBLayer.Entities;
using Microsoft.EntityFrameworkCore;

namespace ESOF.WebApp.DBLayer.Context;

public partial class ApplicationDbContext
{
    public void BuildTestChallenges(ModelBuilder modelBuilder)
    {

        modelBuilder.Entity<TestChallenge>()
            .Property(c => c.Name)
            .IsRequired();

        modelBuilder.Entity<TestChallenge>()
            .Property(c => c.Description)
            .IsRequired();
        modelBuilder.Entity<TestChallenge>()
            .Property(c => c.IdTestChallenge)
            .HasDefaultValueSql("gen_random_uuid()");
    }
}
