using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ESOF.WebApp.DBLayer.Migrations
{
    /// <inheritdoc />
    public partial class PlayerAchievementFix : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropPrimaryKey(
                name: "PK_PlayerAchievements",
                table: "PlayerAchievements");

            migrationBuilder.DropIndex(
                name: "IX_PlayerAchievements_UserId",
                table: "PlayerAchievements");

            migrationBuilder.DropColumn(
                name: "IdPlayerAchievement",
                table: "PlayerAchievements");

            migrationBuilder.DropColumn(
                name: "UnlockedAt",
                table: "PlayerAchievements");

            migrationBuilder.AddColumn<DateOnly>(
                name: "Unlocked",
                table: "PlayerAchievements",
                type: "date",
                nullable: false,
                defaultValue: new DateOnly(1, 1, 1));

            migrationBuilder.AddPrimaryKey(
                name: "PK_PlayerAchievements",
                table: "PlayerAchievements",
                columns: new[] { "UserId", "AchievementId" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropPrimaryKey(
                name: "PK_PlayerAchievements",
                table: "PlayerAchievements");

            migrationBuilder.DropColumn(
                name: "Unlocked",
                table: "PlayerAchievements");

            migrationBuilder.AddColumn<Guid>(
                name: "IdPlayerAchievement",
                table: "PlayerAchievements",
                type: "uuid",
                nullable: false,
                defaultValueSql: "gen_random_uuid()");

            migrationBuilder.AddColumn<DateTime>(
                name: "UnlockedAt",
                table: "PlayerAchievements",
                type: "timestamp with time zone",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddPrimaryKey(
                name: "PK_PlayerAchievements",
                table: "PlayerAchievements",
                column: "IdPlayerAchievement");

            migrationBuilder.CreateIndex(
                name: "IX_PlayerAchievements_UserId",
                table: "PlayerAchievements",
                column: "UserId");
        }
    }
}
