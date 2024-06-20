using ESOF.WebApp.DBLayer.Entities;
using Microsoft.EntityFrameworkCore;

namespace ESOF.WebApp.DBLayer.Context;

public partial class ApplicationDbContext
{
    public void BuildAchievements(ModelBuilder modelBuilder)
    {

        modelBuilder.Entity<Achievement>()
            .Property(a => a.Name)
            .IsRequired();

        modelBuilder.Entity<Achievement>()
            .Property(a => a.Description)
            .IsRequired();

        modelBuilder.Entity<Achievement>()
            .Property(a => a.RequiredScore)
            .IsRequired();
        modelBuilder.Entity<Achievement>()
            .Property(p => p.IdAchievement)
            .HasDefaultValueSql("gen_random_uuid()");
    }
}
