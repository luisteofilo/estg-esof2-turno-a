using ESOF.WebApp.DBLayer.Entities;
using Microsoft.EntityFrameworkCore;

public partial class ApplicationDbContext
{
    private void BuilPost(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Post>()
            .Property(p => p.PostId)
            .HasDefaultValueSql("gen_random_uuid()");
    
        
    }
}