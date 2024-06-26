using ESOF.WebApp.DBLayer.Entities;
using Microsoft.EntityFrameworkCore;

// ReSharper disable once CheckNamespace
namespace ESOF.WebApp.DBLayer.Context;

public partial class ApplicationDbContext
{
    private void BuildUserGameReplays(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<UserGameReplay>()
            .HasKey(ugr => ugr.Id);

        modelBuilder.Entity<UserGameReplay>()
            .Property(ugr => ugr.Id)
            .HasDefaultValueSql("gen_random_uuid()");

        modelBuilder.Entity<UserGameReplay>()
            .HasOne(ugr => ugr.User)
            .WithOne()
            .HasForeignKey<UserGameReplay>(ugr => ugr.UserId);
    }
}