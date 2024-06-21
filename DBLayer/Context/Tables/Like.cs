using ESOF.WebApp.DBLayer.Entities;
using Microsoft.EntityFrameworkCore;

namespace ESOF.WebApp.DBLayer.Context;

    public partial class ApplicationDbContext
    {
        private void BuildLike(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Like>(entity =>
            {
                entity.HasKey(e => e.like_id); 
            
                entity.HasOne(e => e.video)
                    .WithMany(p => p.likes)
                    .HasForeignKey(e => e.video);

                /*entity.HasOne(e => e.user)
                    .WithMany(p => p.likes)
                    .HasForeignKey(e => e.user);*/
            
            });
        }
    }
