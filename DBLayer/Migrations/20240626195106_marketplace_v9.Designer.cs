﻿// <auto-generated />
using System;
using ESOF.WebApp.DBLayer.Context;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace ESOF.WebApp.DBLayer.Migrations
{
    [DbContext(typeof(ApplicationDbContext))]
    [Migration("20240626195106_marketplace_v9")]
    partial class marketplace_v9
    {
        /// <inheritdoc />
        protected override void BuildTargetModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "8.0.6")
                .HasAnnotation("Relational:MaxIdentifierLength", 63);

            NpgsqlModelBuilderExtensions.UseIdentityByDefaultColumns(modelBuilder);

            modelBuilder.Entity("ESOF.WebApp.DBLayer.Entities.Marketplace.GameGenre", b =>
                {
                    b.Property<Guid>("game_id")
                        .HasColumnType("uuid");

                    b.Property<Guid>("genre_id")
                        .HasColumnType("uuid");

                    b.HasKey("game_id", "genre_id");

                    b.HasIndex("genre_id");

                    b.ToTable("GameGenres", "marketplace");
                });

            modelBuilder.Entity("ESOF.WebApp.DBLayer.Entities.Marketplace.GamePlatform", b =>
                {
                    b.Property<Guid>("platform_id")
                        .HasColumnType("uuid");

                    b.Property<Guid>("game_id")
                        .HasColumnType("uuid");

                    b.HasKey("platform_id");

                    b.ToTable("GamePlatforms", "marketplace");
                });

            modelBuilder.Entity("ESOF.WebApp.DBLayer.Entities.Marketplace.Genre", b =>
                {
                    b.Property<Guid>("genre_id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uuid")
                        .HasDefaultValueSql("gen_random_uuid()");

                    b.Property<string>("description")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<string>("name")
                        .IsRequired()
                        .HasColumnType("text");

                    b.HasKey("genre_id");

                    b.ToTable("Genres", "marketplace");
                });

            modelBuilder.Entity("ESOF.WebApp.DBLayer.Entities.Marketplace.MarketPlace_Game", b =>
                {
                    b.Property<Guid>("game_id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uuid")
                        .HasDefaultValueSql("gen_random_uuid()");

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

                    b.ToTable("Games", "marketplace");
                });

            modelBuilder.Entity("ESOF.WebApp.DBLayer.Entities.Marketplace.Order", b =>
                {
                    b.Property<Guid>("order_id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uuid")
                        .HasDefaultValueSql("gen_random_uuid()");

                    b.Property<bool>("completed")
                        .HasColumnType("boolean");

                    b.Property<string>("order_type")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<Guid>("user_id")
                        .HasColumnType("uuid");

                    b.HasKey("order_id");

                    b.HasIndex("user_id");

                    b.ToTable("Orders", "marketplace");
                });

            modelBuilder.Entity("ESOF.WebApp.DBLayer.Entities.Marketplace.OrderItem", b =>
                {
                    b.Property<Guid>("game_id")
                        .HasColumnType("uuid");

                    b.Property<Guid?>("UserId")
                        .HasColumnType("uuid");

                    b.Property<int>("amount")
                        .HasColumnType("integer");

                    b.Property<Guid>("order_id")
                        .HasColumnType("uuid");

                    b.HasKey("game_id");

                    b.HasIndex("UserId");

                    b.HasIndex("order_id");

                    b.ToTable("OrderItems", "marketplace");
                });

            modelBuilder.Entity("ESOF.WebApp.DBLayer.Entities.Marketplace.OrderReview", b =>
                {
                    b.Property<Guid>("reviewer_id")
                        .HasColumnType("uuid");

                    b.Property<Guid>("order_id")
                        .HasColumnType("uuid");

                    b.Property<int>("rating")
                        .HasColumnType("integer");

                    b.Property<string>("review")
                        .IsRequired()
                        .HasColumnType("text");

                    b.HasKey("reviewer_id");

                    b.HasIndex("order_id");

                    b.ToTable("OrderReviews", "marketplace");
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

            modelBuilder.Entity("ESOF.WebApp.DBLayer.Entities.Platform", b =>
                {
                    b.Property<Guid>("platform_id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uuid");

                    b.Property<int>("debut_year")
                        .HasColumnType("integer");

                    b.Property<string>("name")
                        .IsRequired()
                        .HasColumnType("text");

                    b.HasKey("platform_id");

                    b.ToTable("Platforms", "marketplace");
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

            modelBuilder.Entity("ESOF.WebApp.DBLayer.Entities.Marketplace.GameGenre", b =>
                {
                    b.HasOne("ESOF.WebApp.DBLayer.Entities.Marketplace.MarketPlace_Game", "MarketPlaceGame")
                        .WithMany("gameGenres")
                        .HasForeignKey("game_id")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("ESOF.WebApp.DBLayer.Entities.Marketplace.Genre", "genre")
                        .WithMany("gameGenres")
                        .HasForeignKey("genre_id")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("MarketPlaceGame");

                    b.Navigation("genre");
                });

            modelBuilder.Entity("ESOF.WebApp.DBLayer.Entities.Marketplace.GamePlatform", b =>
                {
                    b.HasOne("ESOF.WebApp.DBLayer.Entities.Marketplace.MarketPlace_Game", "MarketPlaceGame")
                        .WithMany("gamePlatforms")
                        .HasForeignKey("platform_id")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("ESOF.WebApp.DBLayer.Entities.Platform", "platform")
                        .WithMany("gamePlatform")
                        .HasForeignKey("platform_id")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("MarketPlaceGame");

                    b.Navigation("platform");
                });

            modelBuilder.Entity("ESOF.WebApp.DBLayer.Entities.Marketplace.Order", b =>
                {
                    b.HasOne("ESOF.WebApp.DBLayer.Entities.User", "user")
                        .WithMany()
                        .HasForeignKey("user_id")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("user");
                });

            modelBuilder.Entity("ESOF.WebApp.DBLayer.Entities.Marketplace.OrderItem", b =>
                {
                    b.HasOne("ESOF.WebApp.DBLayer.Entities.User", null)
                        .WithMany("UserOrderItems")
                        .HasForeignKey("UserId");

                    b.HasOne("ESOF.WebApp.DBLayer.Entities.Marketplace.MarketPlace_Game", "MarketPlaceGame")
                        .WithMany("orderItems")
                        .HasForeignKey("game_id")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("ESOF.WebApp.DBLayer.Entities.Marketplace.Order", "order")
                        .WithMany("orderItems")
                        .HasForeignKey("order_id")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("MarketPlaceGame");

                    b.Navigation("order");
                });

            modelBuilder.Entity("ESOF.WebApp.DBLayer.Entities.Marketplace.OrderReview", b =>
                {
                    b.HasOne("ESOF.WebApp.DBLayer.Entities.Marketplace.Order", "order")
                        .WithMany("reviews")
                        .HasForeignKey("order_id")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("ESOF.WebApp.DBLayer.Entities.User", "Reviewer")
                        .WithMany("UserOrderReviews")
                        .HasForeignKey("reviewer_id")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Reviewer");

                    b.Navigation("order");
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

            modelBuilder.Entity("ESOF.WebApp.DBLayer.Entities.Marketplace.Genre", b =>
                {
                    b.Navigation("gameGenres");
                });

            modelBuilder.Entity("ESOF.WebApp.DBLayer.Entities.Marketplace.MarketPlace_Game", b =>
                {
                    b.Navigation("gameGenres");

                    b.Navigation("gamePlatforms");

                    b.Navigation("orderItems");
                });

            modelBuilder.Entity("ESOF.WebApp.DBLayer.Entities.Marketplace.Order", b =>
                {
                    b.Navigation("orderItems");

                    b.Navigation("reviews");
                });

            modelBuilder.Entity("ESOF.WebApp.DBLayer.Entities.Permission", b =>
                {
                    b.Navigation("RolePermissions");
                });

            modelBuilder.Entity("ESOF.WebApp.DBLayer.Entities.Platform", b =>
                {
                    b.Navigation("gamePlatform");
                });

            modelBuilder.Entity("ESOF.WebApp.DBLayer.Entities.Role", b =>
                {
                    b.Navigation("RolePermissions");

                    b.Navigation("UserRoles");
                });

            modelBuilder.Entity("ESOF.WebApp.DBLayer.Entities.User", b =>
                {
                    b.Navigation("UserOrderItems");

                    b.Navigation("UserOrderReviews");

                    b.Navigation("UserRoles");
                });
#pragma warning restore 612, 618
        }
    }
}
