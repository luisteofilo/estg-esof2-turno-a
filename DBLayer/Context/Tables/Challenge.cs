using ESOF.WebApp.DBLayer.Entities;
using Microsoft.EntityFrameworkCore;

// ReSharper disable once CheckNamespace
namespace ESOF.WebApp.DBLayer.Context;

public partial class ApplicationDbContext
{
    private void BuildChallenge(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Challenge>()
            .Property(ch => ch.Description)
            .IsRequired();

        modelBuilder.Entity<Challenge>()
            .HasOne(ch => ch.Competition)
            .WithMany(c => c.Challenges)
            .HasForeignKey(ch => ch.CompetitionId);
    }
}