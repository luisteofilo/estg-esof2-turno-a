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

            modelBuilder.Entity("ESOF.WebApp.DBLayer.Entities.Challenge", b =>
                {
                    b.Property<Guid>("ChallengeId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uuid");

                    b.Property<Guid>("CompetitionId")
                        .HasColumnType("uuid");

                    b.Property<string>("Description")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<bool>("IsCompleted")
                        .HasColumnType("boolean");

                    b.HasKey("ChallengeId");

                    b.HasIndex("CompetitionId");

                    b.ToTable("Challenges");
                });

            modelBuilder.Entity("ESOF.WebApp.DBLayer.Entities.Competition", b =>
                {
                    b.Property<Guid>("CompetitionId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uuid");

                    b.Property<DateTime>("EndDate")
                        .HasColumnType("timestamp with time zone");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<DateTime>("StartDate")
                        .HasColumnType("timestamp with time zone");

                    b.HasKey("CompetitionId");

                    b.ToTable("Competitions");
                });

            modelBuilder.Entity("ESOF.WebApp.DBLayer.Entities.CompetitionResult", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uuid");

                    b.Property<Guid>("CompetitionId")
                        .HasColumnType("uuid");

                    b.Property<int>("Position")
                        .HasColumnType("integer");

                    b.Property<int>("Score")
                        .HasColumnType("integer");

                    b.Property<Guid>("UserId")
                        .HasColumnType("uuid");

                    b.HasKey("Id");

                    b.HasIndex("CompetitionId");

                    b.HasIndex("UserId");

                    b.ToTable("CompetitionResults");
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

            modelBuilder.Entity("ESOF.WebApp.DBLayer.Entities.Team", b =>
                {
                    b.Property<Guid>("TeamId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uuid");

                    b.Property<Guid>("CreatedByUserId")
                        .HasColumnType("uuid");

                    b.Property<DateTime>("CreationDate")
                        .HasColumnType("timestamp with time zone");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasColumnType("text");

                    b.HasKey("TeamId");

                    b.HasIndex("CreatedByUserId");

                    b.ToTable("Teams");
                });

            modelBuilder.Entity("ESOF.WebApp.DBLayer.Entities.TeamCompetition", b =>
                {
                    b.Property<Guid>("TeamCompetitionId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uuid");

                    b.Property<Guid>("CompetitionId")
                        .HasColumnType("uuid");

                    b.Property<Guid>("TeamId")
                        .HasColumnType("uuid");

                    b.HasKey("TeamCompetitionId");

                    b.HasIndex("CompetitionId");

                    b.HasIndex("TeamId");

                    b.ToTable("TeamCompetition");
                });

            modelBuilder.Entity("ESOF.WebApp.DBLayer.Entities.TeamMember", b =>
                {
                    b.Property<Guid>("TeamId")
                        .HasColumnType("uuid");

                    b.Property<Guid>("UserId")
                        .HasColumnType("uuid");

                    b.Property<DateTime>("JoinDate")
                        .HasColumnType("timestamp with time zone");

                    b.Property<Guid>("TeamMemberId")
                        .HasColumnType("uuid");

                    b.HasKey("TeamId", "UserId");

                    b.HasIndex("UserId");

                    b.ToTable("TeamMembers");
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

            modelBuilder.Entity("ESOF.WebApp.DBLayer.Entities.UserChallenge", b =>
                {
                    b.Property<Guid>("UserId")
                        .HasColumnType("uuid");

                    b.Property<Guid>("ChallengeId")
                        .HasColumnType("uuid");

                    b.Property<DateTime>("CompletedOn")
                        .HasColumnType("timestamp with time zone");

                    b.Property<int>("Score")
                        .HasColumnType("integer");

                    b.Property<Guid>("UserChallengeId")
                        .HasColumnType("uuid");

                    b.HasKey("UserId", "ChallengeId");

                    b.HasIndex("ChallengeId");

                    b.ToTable("UserChallenges");
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

            modelBuilder.Entity("ESOF.WebApp.DBLayer.Entities.Challenge", b =>
                {
                    b.HasOne("ESOF.WebApp.DBLayer.Entities.Competition", "Competition")
                        .WithMany("Challenges")
                        .HasForeignKey("CompetitionId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Competition");
                });

            modelBuilder.Entity("ESOF.WebApp.DBLayer.Entities.CompetitionResult", b =>
                {
                    b.HasOne("ESOF.WebApp.DBLayer.Entities.Competition", "Competition")
                        .WithMany("CompetitionResults")
                        .HasForeignKey("CompetitionId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("ESOF.WebApp.DBLayer.Entities.User", "User")
                        .WithMany("CompetitionResults")
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Competition");

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

            modelBuilder.Entity("ESOF.WebApp.DBLayer.Entities.Team", b =>
                {
                    b.HasOne("ESOF.WebApp.DBLayer.Entities.User", "CreatedByUser")
                        .WithMany("CreatedTeams")
                        .HasForeignKey("CreatedByUserId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("CreatedByUser");
                });

            modelBuilder.Entity("ESOF.WebApp.DBLayer.Entities.TeamCompetition", b =>
                {
                    b.HasOne("ESOF.WebApp.DBLayer.Entities.Competition", "Competition")
                        .WithMany("TeamCompetitions")
                        .HasForeignKey("CompetitionId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("ESOF.WebApp.DBLayer.Entities.Team", "Team")
                        .WithMany("TeamCompetitions")
                        .HasForeignKey("TeamId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Competition");

                    b.Navigation("Team");
                });

            modelBuilder.Entity("ESOF.WebApp.DBLayer.Entities.TeamMember", b =>
                {
                    b.HasOne("ESOF.WebApp.DBLayer.Entities.Team", "Team")
                        .WithMany("TeamMembers")
                        .HasForeignKey("TeamId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("ESOF.WebApp.DBLayer.Entities.User", "User")
                        .WithMany("TeamMembers")
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Team");

                    b.Navigation("User");
                });

            modelBuilder.Entity("ESOF.WebApp.DBLayer.Entities.UserChallenge", b =>
                {
                    b.HasOne("ESOF.WebApp.DBLayer.Entities.Challenge", "Challenge")
                        .WithMany("UserChallenges")
                        .HasForeignKey("ChallengeId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("ESOF.WebApp.DBLayer.Entities.User", "User")
                        .WithMany("UserChallenges")
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Challenge");

                    b.Navigation("User");
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

            modelBuilder.Entity("ESOF.WebApp.DBLayer.Entities.Challenge", b =>
                {
                    b.Navigation("UserChallenges");
                });

            modelBuilder.Entity("ESOF.WebApp.DBLayer.Entities.Competition", b =>
                {
                    b.Navigation("Challenges");

                    b.Navigation("CompetitionResults");

                    b.Navigation("TeamCompetitions");
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

            modelBuilder.Entity("ESOF.WebApp.DBLayer.Entities.Team", b =>
                {
                    b.Navigation("TeamCompetitions");

                    b.Navigation("TeamMembers");
                });

            modelBuilder.Entity("ESOF.WebApp.DBLayer.Entities.User", b =>
                {
                    b.Navigation("CompetitionResults");

                    b.Navigation("CreatedTeams");

                    b.Navigation("TeamMembers");

                    b.Navigation("UserChallenges");

                    b.Navigation("UserRoles");
                });
#pragma warning restore 612, 618
        }
    }
}
