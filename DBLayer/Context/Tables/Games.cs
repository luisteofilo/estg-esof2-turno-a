using ESOF.WebApp.DBLayer.Entities;
using Microsoft.EntityFrameworkCore;

namespace ESOF.WebApp.DBLayer.Context;

public partial class ApplicationDbContext
{
    private void BuildGames(ModelBuilder modelBuilder)
    {
        
        modelBuilder.Entity<Game>()
            .Property(p => p.GameId)
            .HasDefaultValueSql("gen_random_uuid()");
    }
}