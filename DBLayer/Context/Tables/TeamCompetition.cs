using ESOF.WebApp.DBLayer.Entities;
using Microsoft.EntityFrameworkCore;

// ReSharper disable once CheckNamespace
namespace ESOF.WebApp.DBLayer.Context;

public partial class ApplicationDbContext
{
    private void BuildTeamCompetition(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<TeamCompetition>()
            .HasOne(tc => tc.Team)
            .WithMany(t => t.TeamCompetitions)
            .HasForeignKey(tc => tc.TeamId);

        modelBuilder.Entity<TeamCompetition>()
            .HasOne(tc => tc.Competition)
            .WithMany(c => c.TeamCompetitions)
            .HasForeignKey(tc => tc.CompetitionId);
    }
}