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
    }
}