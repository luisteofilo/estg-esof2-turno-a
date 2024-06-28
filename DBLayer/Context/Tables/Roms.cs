using ESOF.WebApp.DBLayer.Entities;
using Microsoft.EntityFrameworkCore;

namespace ESOF.WebApp.DBLayer.Context
{
    public partial class ApplicationDbContext
    {
        private void BuildRoms(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Roms>(entity =>
            {
                entity.HasKey(e => e.RomId);

                entity.Property(e => e.GameId)
                    .IsRequired();
                
                entity.HasOne(r => r.Game)
                    .WithOne(g => g.Roms)
                    .HasForeignKey<Roms>(r => r.GameId);

                entity.HasMany(r => r.SaveStates)
                    .WithOne(s => s.Rom)
                    .HasForeignKey(s => s.RomId);
            });
        }
    }
}