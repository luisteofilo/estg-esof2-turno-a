using ESOF.WebApp.DBLayer.Entities;
using Microsoft.EntityFrameworkCore;

namespace ESOF.WebApp.DBLayer.Context
{
    public partial class ApplicationDbContext
    {
        private void BuildGame(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Game>()
                .Property(g => g.GameId)
                .HasDefaultValueSql("gen_random_uuid()");

            modelBuilder.Entity<Game>(entity =>
            {
                entity.HasKey(e => e.GameId);

                entity.Property(e => e.Name)
                    .IsRequired();

                entity.Property(e => e.ReleaseDate)
                    .IsRequired();
                

                entity.Property(e => e.DeveloperID)
                    .IsRequired();

                entity.HasOne(e => e.Developer)
                    .WithMany(u => u.GamesDeveloped)
                    .HasForeignKey(e => e.DeveloperID);

                entity.Property(e => e.Publisher)
                    .IsRequired();

                entity.Property(e => e.Description)
                    .IsRequired();

                entity.Property(e => e.Price)
                    .IsRequired();

                entity.HasMany(e => e.Shops)
                    .WithOne(s => s.Game)
                    .HasForeignKey(s => s.GameId);

                entity.HasMany(e => e.VideoQuests)
                    .WithOne(c => c.Game)
                    .HasForeignKey(c => c.GameId);


                entity.HasOne(g => g.Roms)
                    .WithOne(r => r.Game)
                    .HasForeignKey<Roms>(r => r.GameId);
            });
        }
    }
}