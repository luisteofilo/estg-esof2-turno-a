using DotNetEnv;
using ESOF.WebApp.DBLayer.Entities;
using Helpers;
using Microsoft.EntityFrameworkCore;

namespace ESOF.WebApp.DBLayer.Context;
public partial class ApplicationDbContext : DbContext
{
    private static readonly DbContextOptions DefaultOptions = new Func<DbContextOptions>(() =>
    {
        var optionsBuilder = new DbContextOptionsBuilder();
        var db = EnvFileHelper.GetString("POSTGRES_DB");
        var user = EnvFileHelper.GetString("POSTGRES_USER");
        var password = EnvFileHelper.GetString("POSTGRES_PASSWORD");
        var port = EnvFileHelper.GetString("POSTGRES_PORT");
        var host = EnvFileHelper.GetString("POSTGRES_HOST");

        if (string.IsNullOrEmpty(db) || string.IsNullOrEmpty(user) || string.IsNullOrEmpty(password) ||
            string.IsNullOrEmpty(port) || string.IsNullOrEmpty(host))
        {
            throw new InvalidOperationException(
                "Database connection information not fully specified in environment variables.");
        }

        var connectionString = $"Host={host};Port={port};Database={db};Username={user};Password={password}";
        optionsBuilder.UseNpgsql(connectionString);
        return optionsBuilder.Options;
    })();

    public ApplicationDbContext()
        : base(DefaultOptions)
    {
    }

    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
        : base(options)
    {
    }

    public DbSet<User> Users { get; set; }
    public DbSet<Role> Roles { get; set; }
    public DbSet<Permission> Permissions { get; set; }
    public DbSet<UserRole> UserRoles { get; set; }
    public DbSet<RolePermission> RolePermissions { get; set; }
    public DbSet<Mod> Mods { get; set; }
    public DbSet<ModTag> ModTags { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
        base.OnConfiguring(optionsBuilder);
    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        BuildUsers(modelBuilder);
        BuildRoles(modelBuilder);
        BuildPermissions(modelBuilder);
        BuildRolePermissions(modelBuilder);
        BuildUserRoles(modelBuilder);
        BuildMods(modelBuilder);
        BuildModTags(modelBuilder);
        
        modelBuilder.Entity<ModTag>().HasData(
            new ModTag { TagId = Guid.NewGuid(), Name = "Graphics", Description = "Mods that enhance graphics, textures, or overall visual appeal." },
            new ModTag { TagId = Guid.NewGuid(), Name = "Adventure", Description = "Mods that add new quests, missions, or enhance exploration." },
            new ModTag { TagId = Guid.NewGuid(), Name = "Audio", Description = "Mods that enhance or change the game’s sound effects, music, and voice acting." },
            new ModTag { TagId = Guid.NewGuid(), Name = "Exploration", Description = "Mods that expand the game world or add new areas to explore." },
            new ModTag { TagId = Guid.NewGuid(), Name = "Characters", Description = "Mods that introduce new characters or alter existing ones." },
            new ModTag { TagId = Guid.NewGuid(), Name = "Weapons and Armor", Description = "Mods that add new weapons, armor, or equipment." },
            new ModTag { TagId = Guid.NewGuid(), Name = "Story", Description = "Mods that introduce new storylines, missions, or quests." },
            new ModTag { TagId = Guid.NewGuid(), Name = "Immersion", Description = "Mods that increase the overall immersive experience of the game." },
            new ModTag { TagId = Guid.NewGuid(), Name = "Quality of Life", Description = "Mods that improve the overall user experience with small but impactful changes." },
            new ModTag { TagId = Guid.NewGuid(), Name = "Survival", Description = "Mods that add survival elements or make the game more challenging." },
            new ModTag { TagId = Guid.NewGuid(), Name = "Multiplayer", Description = "Mods that add or enhance multiplayer capabilities." },
            new ModTag { TagId = Guid.NewGuid(), Name = "Crafting", Description = "Mods that expand or enhance the crafting system in the game." }
        );

        base.OnModelCreating(modelBuilder);
        
    }
}
