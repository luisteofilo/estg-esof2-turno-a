using ESOF.WebApp.DBLayer.Entities;
using Microsoft.EntityFrameworkCore;

namespace ESOF.WebApp.DBLayer.Context;

public partial class ApplicationDbContext{
    private void BuildVotes(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Vote>()
            .HasKey(e => e.VoteId);

        modelBuilder.Entity<Vote>()
            .Property(v => v.VoteId)
            .HasDefaultValueSql("gen_random_uuid()");

        modelBuilder.Entity<Vote>()
            .Property(v => v.VoteTime)
            .IsRequired();

        modelBuilder.Entity<Vote>()
            .Property(v => v.UserId)
            .IsRequired();
        
        modelBuilder.Entity<Vote>()
            .Property(v => v.GameId)
            .IsRequired();

        modelBuilder.Entity<Vote>()
            .HasOne(e => e.User)
            .WithMany(u => u.Votes)
            .HasForeignKey(e => e.UserId)
            .HasConstraintName("id_user__fk");

        modelBuilder.Entity<Vote>()
            .HasOne(e => e.Game)
            .WithMany(g => g.Votes)
            .HasForeignKey(e => e.GameId)
            .HasConstraintName("id_game__fk");
    }
}