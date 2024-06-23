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
                
                entity.HasMany(r => r.SaveStates)
                    .WithOne(s => s.Rom)
                    .HasForeignKey(s => s.RomId);
    
            });
        }
    }
}