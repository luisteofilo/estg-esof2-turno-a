<<<<<<< HEAD
using ESOF.WebApp.DBLayer.Entities;
=======
﻿using ESOF.WebApp.DBLayer.Entities;
>>>>>>> origin/master
using Microsoft.EntityFrameworkCore;

namespace ESOF.WebApp.DBLayer.Context;

// TODO: Implement context for the Games table
public partial class ApplicationDbContext
{
    private void BuildGames(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Game>()
            .HasMany(g => g.Favorites)
            .WithOne(f => f.Game)
            .HasForeignKey(f => f.GameId);

        modelBuilder.Entity<Game>()
            .HasIndex(g => g.Name)
            .IsUnique();

        modelBuilder.Entity<Game>()
            .HasIndex(g => g.Genre);

        modelBuilder.Entity<Game>()
            .HasIndex(g => g.Consoles);

        modelBuilder.Entity<Game>()
            .Property(p => p.GameId)
            .HasDefaultValueSql("gen_random_uuid()");

        modelBuilder.Entity<Favorite>()
            .HasKey(f => new { f.UserId, f.GameId });

        modelBuilder.Entity<Favorite>()
            .HasOne(f => f.User)
            .WithMany(u => u.Favorites)
            .HasForeignKey(f => f.UserId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<Favorite>()
            .HasOne(f => f.Game)
            .WithMany(g => g.Favorites)
            .HasForeignKey(f => f.GameId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<Game>(entity => {
            entity.HasKey(e => e.game_id);

            entity.Property(e => e.name).IsRequired();

            entity.Property(e => e.description).IsRequired();

            entity.Property(e => e.stock).IsRequired();

            entity.Property(e => e.price).IsRequired();

            entity.Property(e => e.release_date).IsRequired();
            
        });
    }
}