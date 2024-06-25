using ESOF.WebApp.DBLayer.Entities;
using Microsoft.EntityFrameworkCore;

namespace ESOF.WebApp.DBLayer.Context;

// TODO: Implement context for the Games table
 public partial class ApplicationDbContext
{
    private void BuildGame(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Game>(entity =>
        {
            entity.ToTable("Games");

            entity.HasKey(e => e.GameId);

            entity.Property(e => e.Name).IsRequired();
            entity.Property(e => e.Genre).IsRequired();
            entity.Property(e => e.Platform).IsRequired();
            entity.Property(e => e.ReleaseDate).IsRequired();

            entity.Property(e => e.GameId)
                    .HasDefaultValueSql("gen_random_uuid()");
        });
    }
}
