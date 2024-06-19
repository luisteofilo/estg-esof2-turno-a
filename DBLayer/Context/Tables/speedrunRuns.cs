using ESOF.WebApp.DBLayer.Entities;
using Microsoft.EntityFrameworkCore;

namespace ESOF.WebApp.DBLayer.Context;

public class speedrunRuns
{
    public void BuildSpeedrunRun(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<speedrunRun>(entity =>
        {
            entity.HasKey(e => e.runID);

            entity.Property(e => e.playerID).IsRequired();

            entity.HasOne(e => e.player)
                .WithMany()
                .HasForeignKey(e => e.playerID);

            entity.Property(e => e.categoryID).IsRequired();

            entity.HasOne(e => e.category)
                .WithMany(c => c.speedrunRuns)
                .HasForeignKey(e => e.categoryID);

            entity.Property(e => e.runTime).IsRequired();

            entity.Property(e => e.SubmissionDate).IsRequired();

            entity.Property(e => e.verified).HasDefaultValue(false);

            entity.Property(e => e.verifierID).IsRequired();

            entity.HasOne(e => e.verifier)
                .WithMany(m => m.SpeedRuns)
                .HasForeignKey(e => e.verifierID);

            entity.Property(e => e.videoLink).IsRequired();
        });
    }
}