using ESOF.WebApp.DBLayer.Entities;
using Microsoft.EntityFrameworkCore;

namespace ESOF.WebApp.DBLayer.Context;

public partial class ApplicationDbContext
{
    public void BuildSpeedrunRuns(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<SpeedrunRun>(entity =>
        {
            entity.HasKey(e => e.runID);
            
            entity.Property(e => e.runID)
                .HasDefaultValueSql("gen_random_uuid()");

            entity.Property(e => e.playerID).IsRequired();

            entity.HasOne(e => e.player)
                .WithMany(p => p.speedrunRuns)
                .HasForeignKey(e => e.playerID);

            entity.Property(e => e.categoryID).IsRequired();

            entity.HasOne(e => e.category)
                .WithMany(c => c.speedrunRuns)
                .HasForeignKey(e => e.categoryID);

            entity.Property(e => e.runTime).IsRequired();

            entity.Property(e => e.SubmissionDate).IsRequired();

            entity.Property(e => e.verified).HasDefaultValue(false);

            entity.HasOne(e => e.verifier)
                .WithMany(m => m.SpeedRuns)
                .HasForeignKey(e => e.verifierID);

            entity.Property(e => e.videoLink).IsRequired();
        });
    }
}