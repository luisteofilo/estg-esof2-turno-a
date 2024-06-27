using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ESOF.WebApp.DBLayer.Migrations
{
    /// <inheritdoc />
    public partial class SmallRefactoring : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Videos_VideoQuests_ChallengeId",
                schema: "gametok",
                table: "Videos");

            migrationBuilder.DropColumn(
                name: "created_at",
                schema: "gametok",
                table: "Likes");

            migrationBuilder.DropColumn(
                name: "created_at",
                schema: "gametok",
                table: "Comments");

            migrationBuilder.RenameColumn(
                name: "ChallengeId",
                schema: "gametok",
                table: "Videos",
                newName: "VideoQuestId");

            migrationBuilder.RenameIndex(
                name: "IX_Videos_ChallengeId",
                schema: "gametok",
                table: "Videos",
                newName: "IX_Videos_VideoQuestId");

            migrationBuilder.RenameColumn(
                name: "comment",
                schema: "gametok",
                table: "Comments",
                newName: "Text");

            migrationBuilder.AddColumn<DateTime>(
                name: "CreatedAt",
                schema: "gametok",
                table: "Videos",
                type: "timestamp with time zone",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<DateTime>(
                name: "CreatedAt",
                schema: "gametok",
                table: "Likes",
                type: "timestamp with time zone",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<DateTime>(
                name: "CreatedAt",
                schema: "gametok",
                table: "Comments",
                type: "timestamp with time zone",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddForeignKey(
                name: "FK_Videos_VideoQuests_VideoQuestId",
                schema: "gametok",
                table: "Videos",
                column: "VideoQuestId",
                principalSchema: "gametok",
                principalTable: "VideoQuests",
                principalColumn: "VideoQuestId",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Videos_VideoQuests_VideoQuestId",
                schema: "gametok",
                table: "Videos");

            migrationBuilder.DropColumn(
                name: "CreatedAt",
                schema: "gametok",
                table: "Videos");

            migrationBuilder.DropColumn(
                name: "CreatedAt",
                schema: "gametok",
                table: "Likes");

            migrationBuilder.DropColumn(
                name: "CreatedAt",
                schema: "gametok",
                table: "Comments");

            migrationBuilder.RenameColumn(
                name: "VideoQuestId",
                schema: "gametok",
                table: "Videos",
                newName: "ChallengeId");

            migrationBuilder.RenameIndex(
                name: "IX_Videos_VideoQuestId",
                schema: "gametok",
                table: "Videos",
                newName: "IX_Videos_ChallengeId");

            migrationBuilder.RenameColumn(
                name: "Text",
                schema: "gametok",
                table: "Comments",
                newName: "comment");

            migrationBuilder.AddColumn<DateTime>(
                name: "created_at",
                schema: "gametok",
                table: "Likes",
                type: "timestamp with time zone",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<DateTime>(
                name: "created_at",
                schema: "gametok",
                table: "Comments",
                type: "timestamp with time zone",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddForeignKey(
                name: "FK_Videos_VideoQuests_ChallengeId",
                schema: "gametok",
                table: "Videos",
                column: "ChallengeId",
                principalSchema: "gametok",
                principalTable: "VideoQuests",
                principalColumn: "VideoQuestId",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
