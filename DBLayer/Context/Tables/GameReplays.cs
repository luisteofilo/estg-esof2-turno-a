using ESOF.WebApp.DBLayer.Entities;
using Microsoft.EntityFrameworkCore;

// ReSharper disable once CheckNamespace
namespace ESOF.WebApp.DBLayer.Context;

public partial class ApplicationDbContext
{
    private void BuildGameReplays(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<GameReplay>()
            .HasKey(gr => gr.Id);

        modelBuilder.Entity<GameReplay>()
            .Property(gr => gr.Id)
            .HasDefaultValueSql("gen_random_uuid()");

        modelBuilder.Entity<GameReplay>()
            .Property(gr => gr.Title)
            .IsRequired()
            .HasMaxLength(255);

        modelBuilder.Entity<GameReplay>()
            .Property(gr => gr.FilePath)
            .IsRequired()
            .HasMaxLength(500);

        modelBuilder.Entity<GameReplay>()
            .Property(gr => gr.UploadDate)
            .IsRequired();
        
        modelBuilder.Entity<GameReplay>()
            .Property(gr => gr.VideoData)
            .HasColumnType("bytea"); // Type to store binary data
        
        modelBuilder.Entity<GameReplay>()
            .HasOne(g => g.User)
            .WithMany(u => u.UserGameReplays)
            .HasForeignKey(g => g.UserId);
    }
}