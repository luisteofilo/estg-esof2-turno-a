using ESOF.WebApp.DBLayer.Entities;
using Microsoft.EntityFrameworkCore;

namespace ESOF.WebApp.DBLayer.Context;

public partial class ApplicationDbContext
{
    public void BuildAchievements(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Achievement>()
            .HasKey(a => a.IdAchievement);

        modelBuilder.Entity<Achievement>()
            .Property(a => a.Name)
            .IsRequired();

        modelBuilder.Entity<Achievement>()
            .Property(a => a.Description)
            .IsRequired();

        modelBuilder.Entity<Achievement>()
            .Property(a => a.RequiredScore)
            .IsRequired();
        
    }
}
