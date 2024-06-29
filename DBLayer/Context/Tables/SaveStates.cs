using ESOF.WebApp.DBLayer.Entities;
using Microsoft.EntityFrameworkCore;

namespace ESOF.WebApp.DBLayer.Context
{
    public partial class ApplicationDbContext
    {
        private void BuildSaveStates(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<SaveStates>(entity =>
            {
                entity.HasKey(e => e.SaveStateId);
                entity.HasOne(ss => ss.Rom)
                    .WithMany(r => r.SaveStates)
                    .HasForeignKey(ss => ss.RomId)
                    .OnDelete(DeleteBehavior.Cascade); 
            
            });
        }
    }
}