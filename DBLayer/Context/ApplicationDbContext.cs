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

    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options) { }
    
    public DbSet<User> Users { get; set; }
    public DbSet<Role> Roles { get; set; }
    public DbSet<Permission> Permissions { get; set; }
    public DbSet<UserRole> UserRoles { get; set; }
    public DbSet<RolePermission> RolePermissions { get; set; }
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
    public DbSet<Roms> Roms { get; set; }
    public DbSet<SaveStates> SaveStates { get; set; }
    
  


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
        BuildSpeedrunCategories(modelBuilder);
        BuildSpeedrunModerators(modelBuilder);
        BuildSpeedrunRuns(modelBuilder);
        BuildGame(modelBuilder); 
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
        BuildRoms(modelBuilder);
        BuildSaveStates(modelBuilder);
        base.OnModelCreating(modelBuilder);
    }
}
