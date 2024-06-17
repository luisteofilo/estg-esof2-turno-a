using ESOF.WebApp.DBLayer.Entities;
using Microsoft.EntityFrameworkCore;

// ReSharper disable once CheckNamespace
namespace ESOF.WebApp.DBLayer.Context;

public partial class ApplicationDbContext
{
    private void BuildModTags(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<ModTag>()
                .Property(p => p.TagId)
                .HasDefaultValueSql("gen_random_uuid()");
    }
}