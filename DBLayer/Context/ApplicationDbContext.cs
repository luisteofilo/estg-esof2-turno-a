using DotNetEnv;
using ESOF.WebApp.DBLayer.Entities;
using Helpers;
using Microsoft.EntityFrameworkCore;
using System;

namespace ESOF.WebApp.DBLayer.Context
{
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
        public DbSet<Game> Games { get; set; }

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
            BuildGame(modelBuilder);
            SeedGames(modelBuilder);
            base.OnModelCreating(modelBuilder);
        }

        private void BuildGameTable(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Game>(entity =>
            {
                entity.ToTable("Games");
        
                entity.HasKey(e => e.GameId);
        
                entity.Property(e => e.Name).IsRequired();
                entity.Property(e => e.Genre).IsRequired();
                entity.Property(e => e.Platform).IsRequired();
                entity.Property(e => e.ReleaseDate).IsRequired();
        
                entity.Property(e => e.GameId)
                      .HasDefaultValueSql("gen_random_uuid()");
            });
        }
        
        // Seed data for Games
        private void SeedGames(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Game>().HasData(
                new Game { GameId = Guid.NewGuid(), Name = "Game 1", Genre = "Action", Platform = "PC", ReleaseDate = DateTime.Parse("2021-01-01") },
                new Game { GameId = Guid.NewGuid(), Name = "Game 2", Genre = "Adventure", Platform = "PS4", ReleaseDate = DateTime.Parse("2022-05-15") },
                new Game { GameId = Guid.NewGuid(), Name = "Game 3", Genre = "RPG", Platform = "Xbox One", ReleaseDate = DateTime.Parse("2020-11-10") },
                new Game { GameId = Guid.NewGuid(), Name = "Game 4", Genre = "Strategy", Platform = "PC", ReleaseDate = DateTime.Parse("2019-09-01") }
            );
        }
    }
}
