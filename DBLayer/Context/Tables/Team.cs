using ESOF.WebApp.DBLayer.Entities;
using Microsoft.EntityFrameworkCore;

// ReSharper disable once CheckNamespace
namespace ESOF.WebApp.DBLayer.Context;

public partial class ApplicationDbContext
{
    private void BuildTeam(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Team>()
            .Property(t => t.Name)
            .IsRequired();

        modelBuilder.Entity<Team>()
            .HasOne(t => t.CreatedByUser)
            .WithMany(u => u.CreatedTeams)
            .HasForeignKey(t => t.CreatedByUserId);
    }
}