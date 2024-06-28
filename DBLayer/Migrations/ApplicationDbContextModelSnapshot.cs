﻿// <auto-generated />
using System;
using ESOF.WebApp.DBLayer.Context;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace ESOF.WebApp.DBLayer.Migrations
{
    [DbContext(typeof(ApplicationDbContext))]
    partial class ApplicationDbContextModelSnapshot : ModelSnapshot
    {
        protected override void BuildModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "8.0.6")
                .HasAnnotation("Relational:MaxIdentifierLength", 63);

            NpgsqlModelBuilderExtensions.UseIdentityByDefaultColumns(modelBuilder);

            modelBuilder.Entity("ESOF.WebApp.DBLayer.Entities.Favorite", b =>
                {
                    b.Property<Guid>("UserId")
                        .HasColumnType("uuid")
                        .HasColumnOrder(0);

                    b.Property<Guid>("GameId")
                        .HasColumnType("uuid")
                        .HasColumnOrder(1);

                    b.HasKey("UserId", "GameId");

                    b.HasIndex("GameId");

                    b.ToTable("Favorites");
                });

            modelBuilder.Entity("ESOF.WebApp.DBLayer.Entities.Game", b =>
                {
                    b.Property<Guid>("GameId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uuid")
                        .HasDefaultValueSql("gen_random_uuid()");

                    b.Property<int[]>("Categories")
                        .IsRequired()
                        .HasColumnType("integer[]");

                    b.Property<int[]>("Consoles")
                        .IsRequired()
                        .HasColumnType("integer[]");

                    b.Property<string>("Description")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<Guid>("DeveloperID")
                        .HasColumnType("uuid");

                    b.Property<int[]>("Genres")
                        .IsRequired()
                        .HasColumnType("integer[]");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<double>("Price")
                        .HasColumnType("double precision");

                    b.Property<string>("Publisher")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<DateTime>("ReleaseDate")
                        .HasColumnType("timestamp with time zone");

                    b.Property<byte[]>("Rom")
                        .IsRequired()
                        .HasColumnType("bytea");

                    b.Property<string>("Url_Image")
                        .IsRequired()
                        .HasColumnType("text");

                    b.HasKey("GameId");

                    b.HasIndex("DeveloperID");

                    b.HasIndex("Genre");

                    b.HasIndex("Name")
                        .IsUnique();

                    b.HasIndex("Consoles");

                    b.ToTable("Games");
                });
            
            modelBuilder.Entity("ESOF.WebApp.DBLayer.Entities.GameReplay", b =>
            {
                b.Property<Guid>("Id")
                    .ValueGeneratedOnAdd()
                    .HasColumnType("uuid")
                    .HasDefaultValueSql("gen_random_uuid()");

                b.Property<string>("FilePath")
                    .IsRequired()
                    .HasMaxLength(500)
                    .HasColumnType("character varying(500)");

                b.Property<string>("Title")
                    .IsRequired()
                    .HasMaxLength(255)
                    .HasColumnType("character varying(255)");

                b.Property<DateTime>("UploadDate")
                    .HasColumnType("timestamp with time zone");

                b.Property<Guid>("UserId")
                    .HasColumnType("uuid");

                b.Property<byte[]>("VideoData")
                    .IsRequired()
                    .HasColumnType("bytea");

                b.HasKey("Id");

                b.HasIndex("UserId");

                b.ToTable("GameReplays");
            });

            modelBuilder.Entity("ESOF.WebApp.DBLayer.Entities.Achievement", b =>
                {
                    b.Property<Guid>("IdAchievement")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uuid")
                        .HasDefaultValueSql("gen_random_uuid()");

                    b.Property<string>("Description")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<long>("RequiredScore")
                        .HasColumnType("bigint");

                    b.HasKey("IdAchievement");

                    b.ToTable("Achievements");
                });

            modelBuilder.Entity("ESOF.WebApp.DBLayer.Entities.Comment", b =>
                {
                    b.Property<Guid>("UserId")
                        .HasColumnType("uuid");

                    b.Property<Guid>("VideoId")
                        .HasColumnType("uuid");

                    b.Property<DateTime>("CreatedAt")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("timestamp with time zone")
                        .HasDefaultValueSql("CURRENT_TIMESTAMP");

                    b.Property<string>("Text")
                        .IsRequired()
                        .HasColumnType("text");

                    b.HasKey("UserId", "VideoId");

                    b.HasIndex("VideoId");

                    b.ToTable("Comments", "gametok");
                });

            modelBuilder.Entity("ESOF.WebApp.DBLayer.Entities.Game", b =>
                {
                    b.Property<Guid>("GameId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uuid")
                        .HasDefaultValueSql("gen_random_uuid()");

                    b.Property<string>("Description")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<string>("Developer")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<double>("Price")
                        .HasColumnType("double precision");

                    b.Property<string>("Publisher")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<DateTime>("ReleaseDate")
                        .HasColumnType("timestamp with time zone");

                    b.Property<string>("Url_Image")
                        .IsRequired()
                        .HasColumnType("text");

                    b.HasKey("GameId");

                    b.ToTable("Games");
                });

            modelBuilder.Entity("ESOF.WebApp.DBLayer.Entities.Like", b =>
                {
                    b.Property<Guid>("UserId")
                        .HasColumnType("uuid");

                    b.Property<Guid>("VideoId")
                        .HasColumnType("uuid");

                    b.Property<DateTime>("CreatedAt")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("timestamp with time zone")
                        .HasDefaultValueSql("CURRENT_TIMESTAMP");

                    b.HasKey("UserId", "VideoId");

                    b.HasIndex("VideoId");

                    b.ToTable("Likes", "gametok");
                });

            modelBuilder.Entity("ESOF.WebApp.DBLayer.Entities.Permission", b =>
                {
                    b.Property<Guid>("PermissionId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uuid")
                        .HasDefaultValueSql("gen_random_uuid()");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasColumnType("text");

                    b.HasKey("PermissionId");

                    b.ToTable("Permissions");
                });

            modelBuilder.Entity("ESOF.WebApp.DBLayer.Entities.PlayerAchievement", b =>
                {
                    b.Property<Guid>("UserId")
                        .HasColumnType("uuid");

                    b.Property<Guid>("AchievementId")
                        .HasColumnType("uuid");

                    b.Property<DateOnly>("Unlocked")
                        .HasColumnType("date");

                    b.HasKey("UserId", "AchievementId");

                    b.HasIndex("AchievementId");

                    b.ToTable("PlayerAchievements");
                });

            modelBuilder.Entity("ESOF.WebApp.DBLayer.Entities.Role", b =>
                {
                    b.Property<Guid>("RoleId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uuid")
                        .HasDefaultValueSql("gen_random_uuid()");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasColumnType("text");

                    b.HasKey("RoleId");

                    b.ToTable("Roles");
                });

            modelBuilder.Entity("ESOF.WebApp.DBLayer.Entities.RolePermission", b =>
                {
                    b.Property<Guid>("RoleId")
                        .HasColumnType("uuid");

                    b.Property<Guid>("PermissionId")
                        .HasColumnType("uuid");

                    b.HasKey("RoleId", "PermissionId");

                    b.HasIndex("PermissionId");

                    b.ToTable("RolePermissions");
                });

            modelBuilder.Entity("ESOF.WebApp.DBLayer.Entities.TestUserScore", b =>
                {
                    b.Property<Guid>("ScoreId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uuid")
                        .HasDefaultValueSql("gen_random_uuid()");

                    b.Property<long>("Score")
                        .HasColumnType("bigint");

                    b.Property<Guid>("UserId")
                        .HasColumnType("uuid");

                    b.HasKey("ScoreId");

                    b.HasIndex("UserId");

                    b.ToTable("TestUserScores");
                });

            modelBuilder.Entity("ESOF.WebApp.DBLayer.Entities.Shops", b =>
                {
                    b.Property<Guid>("ShopId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uuid")
                        .HasDefaultValueSql("gen_random_uuid()");

                    b.Property<DateTime>("Date")
                        .HasColumnType("timestamp with time zone");

                    b.Property<Guid>("GameId")
                        .HasColumnType("uuid");

                    b.Property<Guid>("GameOfMonthId")
                        .HasColumnType("uuid");

                    b.Property<Guid>("gameId")
                        .HasColumnType("uuid");

                    b.HasKey("ShopId");

                    b.HasIndex("GameId");

                    b.ToTable("Shop");
                });

            modelBuilder.Entity("ESOF.WebApp.DBLayer.Entities.SpeedrunCategory", b =>
                {
                    b.Property<Guid>("categoryID")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uuid")
                        .HasDefaultValueSql("gen_random_uuid()");

                    b.Property<string>("categoryDescription")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<string>("categoryName")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<string>("categoryRules")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<DateTimeOffset>("creationDate")
                        .HasColumnType("timestamp with time zone");

                    b.Property<Guid>("gameID")
                        .HasColumnType("uuid");

                    b.HasKey("categoryID");

                    b.HasIndex("gameID");

                    b.ToTable("SpeedrunCategories");
                });

            modelBuilder.Entity("ESOF.WebApp.DBLayer.Entities.SpeedrunModerator", b =>
                {
                    b.Property<Guid>("moderatorID")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uuid")
                        .HasDefaultValueSql("gen_random_uuid()");

                    b.Property<Guid>("gameID")
                        .HasColumnType("uuid");

                    b.Property<DateTimeOffset>("roleGivenDate")
                        .HasColumnType("timestamp with time zone");

                    b.Property<Guid>("userID")
                        .HasColumnType("uuid");

                    b.HasKey("moderatorID");

                    b.HasIndex("gameID");

                    b.HasIndex("userID");

                    b.ToTable("SpeedrunModerators");
                });

            modelBuilder.Entity("ESOF.WebApp.DBLayer.Entities.SpeedrunRun", b =>
                {
                    b.Property<Guid>("runID")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uuid")
                        .HasDefaultValueSql("gen_random_uuid()");

                    b.Property<DateTimeOffset>("SubmissionDate")
                        .HasColumnType("timestamp with time zone");

                    b.Property<Guid>("categoryID")
                        .HasColumnType("uuid");

                    b.Property<Guid>("playerID")
                        .HasColumnType("uuid");

                    b.Property<int>("runTime")
                        .HasColumnType("integer");

                    b.Property<bool>("verified")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("boolean")
                        .HasDefaultValue(false);

                    b.Property<Guid?>("verifierID")
                        .HasColumnType("uuid");

                    b.Property<string>("videoLink")
                        .IsRequired()
                        .HasColumnType("text");

                    b.HasKey("runID");

                    b.HasIndex("categoryID");

                    b.HasIndex("playerID");

                    b.HasIndex("verifierID");

                    b.ToTable("SpeedrunRuns");
                });

            modelBuilder.Entity("ESOF.WebApp.DBLayer.Entities.User", b =>
                {
                    b.Property<Guid>("UserId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uuid")
                        .HasDefaultValueSql("gen_random_uuid()");

                    b.Property<string>("Email")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<byte[]>("PasswordHash")
                        .IsRequired()
                        .HasColumnType("bytea");

                    b.Property<byte[]>("PasswordSalt")
                        .IsRequired()
                        .HasColumnType("bytea");

                    b.HasKey("UserId");

                    b.HasIndex("Email")
                        .IsUnique();

                    b.ToTable("Users");
                });

            modelBuilder.Entity("ESOF.WebApp.DBLayer.Entities.UserRole", b =>
                {
                    b.Property<Guid>("RoleId")
                        .HasColumnType("uuid");

                    b.Property<Guid>("UserId")
                        .HasColumnType("uuid");

                    b.HasKey("RoleId", "UserId");

                    b.HasIndex("UserId");

                    b.ToTable("UserRoles");
                });

            modelBuilder.Entity("ESOF.WebApp.DBLayer.Entities.PlayerAchievement", b =>
                {
                    b.HasOne("ESOF.WebApp.DBLayer.Entities.Achievement", "Achievement")
                        .WithMany("PlayerAchievements")
                        .HasForeignKey("AchievementId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("ESOF.WebApp.DBLayer.Entities.User", "User")
                        .WithMany("PlayerAchievements")
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Achievement");

                    b.Navigation("User");
                });

            modelBuilder.Entity("ESOF.WebApp.DBLayer.Entities.Game", b =>
                {
                    b.HasOne("ESOF.WebApp.DBLayer.Entities.User", "Developer")
                        .WithMany("GamesDeveloped")
                        .HasForeignKey("DeveloperID")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Developer");
                });

            modelBuilder.Entity("ESOF.WebApp.DBLayer.Entities.Favorite", b =>
                {
                    b.HasOne("ESOF.WebApp.DBLayer.Entities.Game", "Game")
                        .WithMany("Favorites")
                        .HasForeignKey("GameId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("ESOF.WebApp.DBLayer.Entities.User", "User")
                        .WithMany("Favorites")
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Game");

                    b.Navigation("User");
                });

            modelBuilder.Entity("ESOF.WebApp.DBLayer.Entities.Video", b =>
                {
                    b.Property<Guid>("VideoId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uuid")
                        .HasDefaultValueSql("gen_random_uuid()");

                    b.Property<string>("Caption")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<DateTime>("CreatedAt")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("timestamp with time zone")
                        .HasDefaultValueSql("CURRENT_TIMESTAMP");

                    b.Property<Guid>("UserId")
                        .HasColumnType("uuid");

                    b.Property<string>("VideoPath")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<Guid>("VideoQuestId")
                        .HasColumnType("uuid");

                    b.Property<int>("ViewCount")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("integer")
                        .HasDefaultValue(0);

                    b.HasKey("VideoId");

                    b.HasIndex("UserId");

                    b.HasIndex("VideoQuestId");

                    b.ToTable("Videos", "gametok");
                });

            modelBuilder.Entity("ESOF.WebApp.DBLayer.Entities.VideoQuest", b =>
                {
                    b.Property<Guid>("VideoQuestId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uuid")
                        .HasDefaultValueSql("gen_random_uuid()");

                    b.Property<DateTime>("CreatedAt")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("timestamp with time zone")
                        .HasDefaultValueSql("CURRENT_TIMESTAMP");

                    b.Property<string>("Description")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<Guid>("GameId")
                        .HasColumnType("uuid");

                    b.HasKey("VideoQuestId");

                    b.HasIndex("GameId");

                    b.ToTable("VideoQuests", "gametok");
                });

            modelBuilder.Entity("ESOF.WebApp.DBLayer.Entities.Comment", b =>
                {
                    b.HasOne("ESOF.WebApp.DBLayer.Entities.User", "User")
                        .WithMany()
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("ESOF.WebApp.DBLayer.Entities.Video", "Video")
                        .WithMany("Comments")
                        .HasForeignKey("VideoId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("User");

                    b.Navigation("Video");
                });

            modelBuilder.Entity("ESOF.WebApp.DBLayer.Entities.Like", b =>
                {
                    b.HasOne("ESOF.WebApp.DBLayer.Entities.User", "User")
                        .WithMany()
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("ESOF.WebApp.DBLayer.Entities.Video", "Video")
                        .WithMany("Likes")
                        .HasForeignKey("VideoId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("User");

                    b.Navigation("Video");
                });

            modelBuilder.Entity("ESOF.WebApp.DBLayer.Entities.GameReplay", b =>
                {
                    b.HasOne("ESOF.WebApp.DBLayer.Entities.User", "User")
                        .WithMany("UserGameReplays")
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("User");
                });

            modelBuilder.Entity("ESOF.WebApp.DBLayer.Entities.RolePermission", b =>
                {
                    b.HasOne("ESOF.WebApp.DBLayer.Entities.Permission", "Permission")
                        .WithMany("RolePermissions")
                        .HasForeignKey("PermissionId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("ESOF.WebApp.DBLayer.Entities.Role", "Role")
                        .WithMany("RolePermissions")
                        .HasForeignKey("RoleId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Permission");

                    b.Navigation("Role");
                });

            modelBuilder.Entity("ESOF.WebApp.DBLayer.Entities.TestUserScore", b =>
                {
                    b.HasOne("ESOF.WebApp.DBLayer.Entities.User", "User")
                        .WithMany("TestUserScores")
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("User");
                });

            modelBuilder.Entity("ESOF.WebApp.DBLayer.Entities.Shops", b =>
                {
                    b.HasOne("ESOF.WebApp.DBLayer.Entities.Game", "Game")
                        .WithMany("Shops")
                        .HasForeignKey("GameId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Game");
                });

            modelBuilder.Entity("ESOF.WebApp.DBLayer.Entities.SpeedrunCategory", b =>
                {
                    b.HasOne("ESOF.WebApp.DBLayer.Entities.Game", "Game")
                        .WithMany("speedrunCategories")
                        .HasForeignKey("gameID")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Game");
                });

            modelBuilder.Entity("ESOF.WebApp.DBLayer.Entities.SpeedrunModerator", b =>
                {
                    b.HasOne("ESOF.WebApp.DBLayer.Entities.Game", "game")
                        .WithMany("speedrunModerators")
                        .HasForeignKey("gameID")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("ESOF.WebApp.DBLayer.Entities.User", "user")
                        .WithMany("speedrunModerators")
                        .HasForeignKey("userID")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("game");

                    b.Navigation("user");
                });

            modelBuilder.Entity("ESOF.WebApp.DBLayer.Entities.SpeedrunRun", b =>
                {
                    b.HasOne("ESOF.WebApp.DBLayer.Entities.SpeedrunCategory", "category")
                        .WithMany("speedrunRuns")
                        .HasForeignKey("categoryID")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("ESOF.WebApp.DBLayer.Entities.User", "player")
                        .WithMany("speedrunRuns")
                        .HasForeignKey("playerID")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("ESOF.WebApp.DBLayer.Entities.SpeedrunModerator", "verifier")
                        .WithMany("SpeedRuns")
                        .HasForeignKey("verifierID");

                    b.Navigation("category");

                    b.Navigation("player");

                    b.Navigation("verifier");
                });

            modelBuilder.Entity("ESOF.WebApp.DBLayer.Entities.UserRole", b =>
                {
                    b.HasOne("ESOF.WebApp.DBLayer.Entities.Role", "Role")
                        .WithMany("UserRoles")
                        .HasForeignKey("RoleId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("ESOF.WebApp.DBLayer.Entities.User", "User")
                        .WithMany("UserRoles")
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Role");

                    b.Navigation("User");
                });

            modelBuilder.Entity("ESOF.WebApp.DBLayer.Entities.Video", b =>
                {
                    b.HasOne("ESOF.WebApp.DBLayer.Entities.User", "User")
                        .WithMany()
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("ESOF.WebApp.DBLayer.Entities.VideoQuest", "VideoQuest")
                        .WithMany("Videos")
                        .HasForeignKey("VideoQuestId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("User");

                    b.Navigation("VideoQuest");
                });

            modelBuilder.Entity("ESOF.WebApp.DBLayer.Entities.VideoQuest", b =>
                {
                    b.HasOne("ESOF.WebApp.DBLayer.Entities.Game", "Game")
                        .WithMany("VideoQuests")
                        .HasForeignKey("GameId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Game");
                });

            modelBuilder.Entity("ESOF.WebApp.DBLayer.Entities.Game", b =>
                {
                    b.Navigation("VideoQuests");
                });

            modelBuilder.Entity("ESOF.WebApp.DBLayer.Entities.Achievement", b =>
                {
                    b.Navigation("PlayerAchievements");
                });

            modelBuilder.Entity("ESOF.WebApp.DBLayer.Entities.Game", b =>
                {
                    b.Navigation("Favorites");
                    b.Navigation("Shops");

                    b.Navigation("speedrunCategories");

                    b.Navigation("speedrunModerators");
                });

            modelBuilder.Entity("ESOF.WebApp.DBLayer.Entities.Permission", b =>
                {
                    b.Navigation("RolePermissions");
                });

            modelBuilder.Entity("ESOF.WebApp.DBLayer.Entities.Role", b =>
                {
                    b.Navigation("RolePermissions");

                    b.Navigation("UserRoles");
                });

            modelBuilder.Entity("ESOF.WebApp.DBLayer.Entities.SpeedrunCategory", b =>
                {
                    b.Navigation("speedrunRuns");
                });

            modelBuilder.Entity("ESOF.WebApp.DBLayer.Entities.SpeedrunModerator", b =>
                {
                    b.Navigation("SpeedRuns");
                });

            modelBuilder.Entity("ESOF.WebApp.DBLayer.Entities.User", b =>
                {
                    b.Navigation("UserGameReplays");

                    b.Navigation("PlayerAchievements");

                    b.Navigation("TestUserScores");

                    b.Navigation("GamesDeveloped");

                    b.Navigation("Favorites");

                    b.Navigation("UserRoles");

                    b.Navigation("speedrunModerators");

                    b.Navigation("speedrunRuns");
                });

            modelBuilder.Entity("ESOF.WebApp.DBLayer.Entities.Video", b =>
                {
                    b.Navigation("Comments");

                    b.Navigation("Likes");
                });

            modelBuilder.Entity("ESOF.WebApp.DBLayer.Entities.VideoQuest", b =>
                {
                    b.Navigation("Videos");
                });
#pragma warning restore 612, 618
        }
    }
}
