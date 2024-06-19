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

            modelBuilder.Entity("ESOF.WebApp.DBLayer.Entities.Game", b =>
                {
                    b.Property<Guid>("game_id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uuid");

                    b.Property<string>("description")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<string>("name")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<float>("price")
                        .HasColumnType("real");

                    b.Property<DateTimeOffset>("release_date")
                        .HasColumnType("timestamp with time zone");

                    b.Property<int>("stock")
                        .HasColumnType("integer");

                    b.HasKey("game_id");

                    b.ToTable("Game");
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

            modelBuilder.Entity("ESOF.WebApp.DBLayer.Entities.speedrunCategory", b =>
                {
                    b.Property<Guid>("categoryID")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uuid");

                    b.Property<string>("categoryDescription")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<string>("categoryName")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<string>("categoryRules")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<DateTime>("creationDate")
                        .HasColumnType("timestamp with time zone");

                    b.Property<Guid>("gameID")
                        .HasColumnType("uuid");

                    b.HasKey("categoryID");

                    b.HasIndex("gameID");

                    b.ToTable("speedrunCategory");
                });

            modelBuilder.Entity("ESOF.WebApp.DBLayer.Entities.speedrunModerator", b =>
                {
                    b.Property<Guid>("moderatorID")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uuid");

                    b.Property<Guid>("gameID")
                        .HasColumnType("uuid");

                    b.Property<DateTime>("roleGivenDate")
                        .HasColumnType("timestamp with time zone");

                    b.Property<Guid>("userID")
                        .HasColumnType("uuid");

                    b.HasKey("moderatorID");

                    b.HasIndex("gameID");

                    b.HasIndex("userID");

                    b.ToTable("speedrunModerator");
                });

            modelBuilder.Entity("ESOF.WebApp.DBLayer.Entities.speedrunRun", b =>
                {
                    b.Property<Guid>("runID")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uuid");

                    b.Property<DateTime>("SubmissionDate")
                        .HasColumnType("timestamp with time zone");

                    b.Property<Guid>("categoryID")
                        .HasColumnType("uuid");

                    b.Property<Guid>("playerID")
                        .HasColumnType("uuid");

                    b.Property<int>("runTime")
                        .HasColumnType("integer");

                    b.Property<bool>("verified")
                        .HasColumnType("boolean");

                    b.Property<Guid>("verifierID")
                        .HasColumnType("uuid");

                    b.Property<string>("videoLink")
                        .IsRequired()
                        .HasColumnType("text");

                    b.HasKey("runID");

                    b.HasIndex("categoryID");

                    b.HasIndex("playerID");

                    b.HasIndex("verifierID");

                    b.ToTable("speedrunRun");
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

            modelBuilder.Entity("ESOF.WebApp.DBLayer.Entities.speedrunCategory", b =>
                {
                    b.HasOne("ESOF.WebApp.DBLayer.Entities.Game", "Game")
                        .WithMany()
                        .HasForeignKey("gameID")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Game");
                });

            modelBuilder.Entity("ESOF.WebApp.DBLayer.Entities.speedrunModerator", b =>
                {
                    b.HasOne("ESOF.WebApp.DBLayer.Entities.Game", "game")
                        .WithMany()
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

            modelBuilder.Entity("ESOF.WebApp.DBLayer.Entities.speedrunRun", b =>
                {
                    b.HasOne("ESOF.WebApp.DBLayer.Entities.speedrunCategory", "category")
                        .WithMany("speedrunRuns")
                        .HasForeignKey("categoryID")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("ESOF.WebApp.DBLayer.Entities.User", "player")
                        .WithMany("speedrunRuns")
                        .HasForeignKey("playerID")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("ESOF.WebApp.DBLayer.Entities.speedrunModerator", "verifier")
                        .WithMany("SpeedRuns")
                        .HasForeignKey("verifierID")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("category");

                    b.Navigation("player");

                    b.Navigation("verifier");
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

            modelBuilder.Entity("ESOF.WebApp.DBLayer.Entities.User", b =>
                {
                    b.Navigation("UserRoles");

                    b.Navigation("speedrunModerators");

                    b.Navigation("speedrunRuns");
                });

            modelBuilder.Entity("ESOF.WebApp.DBLayer.Entities.speedrunCategory", b =>
                {
                    b.Navigation("speedrunRuns");
                });

            modelBuilder.Entity("ESOF.WebApp.DBLayer.Entities.speedrunModerator", b =>
                {
                    b.Navigation("SpeedRuns");
                });
#pragma warning restore 612, 618
        }
    }
}
