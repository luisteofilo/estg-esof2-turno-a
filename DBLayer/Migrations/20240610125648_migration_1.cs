using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ESOF.WebApp.DBLayer.Migrations
{
    /// <inheritdoc />
    public partial class migration_1 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Shop_Games_gameId",
                table: "Shop");

            migrationBuilder.DropIndex(
                name: "IX_Shop_gameId",
                table: "Shop");

            migrationBuilder.RenameColumn(
                name: "date",
                table: "Shop",
                newName: "Date");

            migrationBuilder.RenameColumn(
                name: "gameOfMonthId",
                table: "Shop",
                newName: "GameOfMonthId");

            migrationBuilder.RenameColumn(
                name: "gameId",
                table: "Games",
                newName: "GameId");

            migrationBuilder.AddColumn<Guid>(
                name: "GameId",
                table: "Shop",
                type: "uuid",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.CreateIndex(
                name: "IX_Shop_GameId",
                table: "Shop",
                column: "GameId");

            migrationBuilder.AddForeignKey(
                name: "FK_Shop_Games_GameId",
                table: "Shop",
                column: "GameId",
                principalTable: "Games",
                principalColumn: "GameId",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Shop_Games_GameId",
                table: "Shop");

            migrationBuilder.DropIndex(
                name: "IX_Shop_GameId",
                table: "Shop");

            migrationBuilder.DropColumn(
                name: "GameId",
                table: "Shop");

            migrationBuilder.RenameColumn(
                name: "Date",
                table: "Shop",
                newName: "date");

            migrationBuilder.RenameColumn(
                name: "GameOfMonthId",
                table: "Shop",
                newName: "gameOfMonthId");

            migrationBuilder.RenameColumn(
                name: "GameId",
                table: "Games",
                newName: "gameId");

            migrationBuilder.CreateIndex(
                name: "IX_Shop_gameId",
                table: "Shop",
                column: "gameId");

            migrationBuilder.AddForeignKey(
                name: "FK_Shop_Games_gameId",
                table: "Shop",
                column: "gameId",
                principalTable: "Games",
                principalColumn: "gameId",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
