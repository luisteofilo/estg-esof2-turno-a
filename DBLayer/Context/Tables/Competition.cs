using ESOF.WebApp.DBLayer.Entities;
using Microsoft.EntityFrameworkCore;

// ReSharper disable once CheckNamespace
namespace ESOF.WebApp.DBLayer.Context;

public partial class ApplicationDbContext
{
    private void BuildCompetition(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Competition>()
            .Property(c => c.Name)
            .IsRequired();

        modelBuilder.Entity<Competition>()
            .HasMany(c => c.CompetitionResults)
            .WithOne(cr => cr.Competition)
            .HasForeignKey(cr => cr.CompetitionId);

        modelBuilder.Entity<Competition>()
            .HasMany(c => c.Challenges)
            .WithOne(ch => ch.Competition)
            .HasForeignKey(ch => ch.CompetitionId);
    }
}