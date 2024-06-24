using ESOF.WebApp.DBLayer.Entities;
using Microsoft.EntityFrameworkCore;

// ReSharper disable once CheckNamespace
namespace ESOF.WebApp.DBLayer.Context;

public partial class ApplicationDbContext
{
    private void BuildCompetitionResult(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<CompetitionResult>()
            .HasOne(cr => cr.User)
            .WithMany(u => u.CompetitionResults)
            .HasForeignKey(cr => cr.UserId);

        modelBuilder.Entity<CompetitionResult>()
            .HasOne(cr => cr.Competition)
            .WithMany(c => c.CompetitionResults)
            .HasForeignKey(cr => cr.CompetitionId);
    }
}