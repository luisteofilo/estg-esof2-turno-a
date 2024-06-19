using ESOF.WebApp.DBLayer.Entities;
using Microsoft.EntityFrameworkCore;

namespace ESOF.WebApp.DBLayer.Context;

public partial class ApplicationDbContext
{
    public void BuildSpeedrunModerators(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<speedrunModerator>(entity =>
        {
            entity.HasKey(e => e.moderatorID);
            
            entity.Property(e => e.moderatorID)
                .HasDefaultValueSql("gen_random_uuid()");

            entity.Property(e => e.userID).IsRequired();

            entity.HasOne(e => e.user)
                .WithMany()
                .HasForeignKey(e => e.userID);

            entity.Property(e => e.gameID).IsRequired();

            entity.HasOne(e => e.game)
                .WithMany()
                .HasForeignKey(e => e.gameID);

            entity.Property(e => e.roleGivenDate).IsRequired();

            entity.HasMany(e => e.SpeedRuns)
                .WithOne(run => run.verifier)
                .HasForeignKey(run => run.verifierID);
        });
    }
}