using ESOF.WebApp.DBLayer.Entities;
using Microsoft.EntityFrameworkCore;

// ReSharper disable once CheckNamespace
namespace ESOF.WebApp.DBLayer.Context;

public partial class ApplicationDbContext
{
    private void BuildMods(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Mod>()
                .Property(p => p.ModId)
                .HasDefaultValueSql("gen_random_uuid()");

            modelBuilder.Entity<Mod>()
                .HasMany(m => m.Tags)
                .WithMany(t => t.Mods)
                .UsingEntity<Dictionary<string, object>>(
                    "ModModTag",
                    j => j
                        .HasOne<ModTag>()
                        .WithMany()
                        .HasForeignKey("TagId")
                        .HasConstraintName("FK_ModModTags_ModTags_TagId"),
                    j => j
                        .HasOne<Mod>()
                        .WithMany()
                        .HasForeignKey("ModId")
                        .HasConstraintName("FK_ModModTags_Mods_ModId"));
    }
}