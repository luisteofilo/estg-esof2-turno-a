using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ESOF.WebApp.DBLayer.Migrations
{
    /// <inheritdoc />
    public partial class marketplace_v9 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_GameGenres_Games_genre_id",
                schema: "marketplace",
                table: "GameGenres");

            migrationBuilder.AddForeignKey(
                name: "FK_GameGenres_Games_game_id",
                schema: "marketplace",
                table: "GameGenres",
                column: "game_id",
                principalSchema: "marketplace",
                principalTable: "Games",
                principalColumn: "game_id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_GameGenres_Games_game_id",
                schema: "marketplace",
                table: "GameGenres");

            migrationBuilder.AddForeignKey(
                name: "FK_GameGenres_Games_genre_id",
                schema: "marketplace",
                table: "GameGenres",
                column: "genre_id",
                principalSchema: "marketplace",
                principalTable: "Games",
                principalColumn: "game_id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
