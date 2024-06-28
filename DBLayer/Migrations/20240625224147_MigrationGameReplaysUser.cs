using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ESOF.WebApp.DBLayer.Migrations
{
    /// <inheritdoc />
    public partial class MigrationGameReplaysUser : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<Guid>(
                name: "UserId",
                table: "GameReplays",
                type: "uuid",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.CreateIndex(
                name: "IX_GameReplays_UserId",
                table: "GameReplays",
                column: "UserId");

            migrationBuilder.AddForeignKey(
                name: "FK_GameReplays_Users_UserId",
                table: "GameReplays",
                column: "UserId",
                principalTable: "Users",
                principalColumn: "UserId",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_GameReplays_Users_UserId",
                table: "GameReplays");

            migrationBuilder.DropIndex(
                name: "IX_GameReplays_UserId",
                table: "GameReplays");

            migrationBuilder.DropColumn(
                name: "UserId",
                table: "GameReplays");
        }
    }
}
