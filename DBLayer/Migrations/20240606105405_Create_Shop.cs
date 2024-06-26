using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ESOF.WebApp.DBLayer.Migrations
{
    /// <inheritdoc />
    public partial class Create_Shop : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Shops_Games_gameId",
                table: "Shops");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Shops",
                table: "Shops");

            migrationBuilder.RenameTable(
                name: "Shops",
                newName: "Shop");

            migrationBuilder.RenameIndex(
                name: "IX_Shops_gameId",
                table: "Shop",
                newName: "IX_Shop_gameId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Shop",
                table: "Shop",
                column: "gameOfMonthId");

            migrationBuilder.AddForeignKey(
                name: "FK_Shop_Games_gameId",
                table: "Shop",
                column: "gameId",
                principalTable: "Games",
                principalColumn: "gameId",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Shop_Games_gameId",
                table: "Shop");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Shop",
                table: "Shop");

            migrationBuilder.RenameTable(
                name: "Shop",
                newName: "Shops");

            migrationBuilder.RenameIndex(
                name: "IX_Shop_gameId",
                table: "Shops",
                newName: "IX_Shops_gameId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Shops",
                table: "Shops",
                column: "gameOfMonthId");

            migrationBuilder.AddForeignKey(
                name: "FK_Shops_Games_gameId",
                table: "Shops",
                column: "gameId",
                principalTable: "Games",
                principalColumn: "gameId",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
