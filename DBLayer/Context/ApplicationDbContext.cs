using DotNetEnv;
using ESOF.WebApp.DBLayer.Entities;
using ESOF.WebApp.DBLayer.Entities.Marketplace;
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
    //Para os achievements
    public DbSet<Achievement> Achievements { get; set; }
    public DbSet<PlayerAchievement> PlayerAchievements { get; set; }
    public DbSet<TestUserScore> TestUserScores { get; set; }
    public DbSet<MarketPlace_Game> MarketPlaceGames { get; set; }
    public DbSet<GameGenre> GameGenres { get; set; }
    public DbSet<GamePlatform> GamePlatforms { get; set; }
    public DbSet<Genre> Genres { get; set; }
    public DbSet<Order> Orders { get; set; }
    public DbSet<OrderItem> OrderItems { get; set; }
    public DbSet<Platform> Platforms { get; set; }
    public DbSet<OrderReview> OrderReviews { get; set; }
    public DbSet<Comment> Comments { get; set; }
    public DbSet<Like> Likes { get; set; }
    public DbSet<Video> Videos { get; set; }
    public DbSet<VideoQuest> VideoQuests { get; set; }
    public DbSet<Game> Games { get; set; }
    public DbSet<Shops> Shop { get; set; }
    public DbSet<SpeedrunRun> SpeedrunRuns { get; set; }
    public DbSet<SpeedrunCategory> SpeedrunCategories { get; set; }
    public DbSet<SpeedrunModerator> SpeedrunModerators { get; set; }
    public DbSet<GameReplay> GameReplays { get; set; }
    public DbSet<Favorite> Favorites { get; set; }
    public DbSet<Review> Reviews { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
        base.OnConfiguring(optionsBuilder);
    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        BuildShops(modelBuilder);
        BuildGame(modelBuilder);
        BuildUsers(modelBuilder);
        BuildRoles(modelBuilder);
        BuildPermissions(modelBuilder);
        BuildRolePermissions(modelBuilder);
        BuildUserRoles(modelBuilder);
        BuildMods(modelBuilder);
        BuildModTags(modelBuilder);
        // Configurar relacionamento muitos-para-muitos entre Mod e ModTag
        modelBuilder.Entity<Mod>()
            .HasMany(m => m.Tags)
            .WithMany(t => t.Mods)
            .UsingEntity<Dictionary<string, object>>(
                "ModModTag",
                j => j.HasOne<ModTag>().WithMany().HasForeignKey("TagId"),
                j => j.HasOne<Mod>().WithMany().HasForeignKey("ModId"));

        modelBuilder.Entity<ModTag>().HasData(
            new ModTag { TagId = Guid.NewGuid(), Name = "Graphics", Description = "Mods that enhance graphics, textures, or overall visual appeal." },
            new ModTag { TagId = Guid.NewGuid(), Name = "Adventure", Description = "Mods that add new quests, missions, or enhance exploration." },
            new ModTag { TagId = Guid.NewGuid(), Name = "Audio", Description = "Mods that enhance or change the game’s sound effects, music, and voice acting." },
            new ModTag { TagId = Guid.NewGuid(), Name = "Exploration", Description = "Mods that expand the game world or add new areas to explore." },
            new ModTag { TagId = Guid.NewGuid(), Name = "Characters", Description = "Mods that introduce new characters or alter existing ones." },
            new ModTag { TagId = Guid.NewGuid(), Name = "Weapons and Armor", Description = "Mods that add new weapons, armor, or equipment." },
            new ModTag { TagId = Guid.NewGuid(), Name = "Story", Description = "Mods that introduce new storylines, missions, ou quests." },
            new ModTag { TagId = Guid.NewGuid(), Name = "Immersion", Description = "Mods that increase the overall immersive experience of the game." },
            new ModTag { TagId = Guid.NewGuid(), Name = "Quality of Life", Description = "Mods that improve the overall user experience with small but impactful changes." },
            new ModTag { TagId = Guid.NewGuid(), Name = "Survival", Description = "Mods that add survival elements or make the game more challenging." },
            new ModTag { TagId = Guid.NewGuid(), Name = "Multiplayer", Description = "Mods that add or enhance multiplayer capabilities." },
            new ModTag { TagId = Guid.NewGuid(), Name = "Crafting", Description = "Mods that expand or enhance the crafting system in the game." }
        );

        BuildSpeedrunCategories(modelBuilder);
        BuildSpeedrunModerators(modelBuilder);
        BuildSpeedrunRuns(modelBuilder);
        BuildFavorites(modelBuilder);
        //Build para os Achievements
        BuildAchievements(modelBuilder);
        BuildPlayerAchievements(modelBuilder);
        //Build para tabelas de teste de scores
        BuildTestUserScores(modelBuilder);
        BuildMarketPlace_Game(modelBuilder);
        BuildGameGenre(modelBuilder);
        BuildGamePlatform(modelBuilder);
        BuildGenreMarketplace(modelBuilder);
        BuildOrder(modelBuilder);
        BuildOrderItem(modelBuilder);
        BuildPlatform(modelBuilder);
        BuildReview(modelBuilder);
        BuildVideoQuest(modelBuilder);
        BuildComment(modelBuilder);
        BuildLike(modelBuilder);
        BuildVideo(modelBuilder);
        BuildReviews(modelBuilder);

        base.OnModelCreating(modelBuilder);
    }
}
