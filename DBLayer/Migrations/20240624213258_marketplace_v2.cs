using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ESOF.WebApp.DBLayer.Migrations
{
    /// <inheritdoc />
    public partial class marketplace_v2 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_GameGenres_MarketPlaceGames_genre_id",
                table: "GameGenres");

            migrationBuilder.DropForeignKey(
                name: "FK_GamePlatforms_MarketPlaceGames_platform_id",
                table: "GamePlatforms");

            migrationBuilder.DropForeignKey(
                name: "FK_OrderItems_MarketPlaceGames_game_id",
                table: "OrderItems");

            migrationBuilder.DropForeignKey(
                name: "FK_OrderReviews_MarketPlaceGames_game_id",
                table: "OrderReviews");

            migrationBuilder.DropPrimaryKey(
                name: "PK_MarketPlaceGames",
                table: "MarketPlaceGames");

            migrationBuilder.EnsureSchema(
                name: "marketplace");

            migrationBuilder.RenameTable(
                name: "Platforms",
                newName: "Platforms",
                newSchema: "marketplace");

            migrationBuilder.RenameTable(
                name: "Orders",
                newName: "Orders",
                newSchema: "marketplace");

            migrationBuilder.RenameTable(
                name: "OrderReviews",
                newName: "OrderReviews",
                newSchema: "marketplace");

            migrationBuilder.RenameTable(
                name: "OrderItems",
                newName: "OrderItems",
                newSchema: "marketplace");

            migrationBuilder.RenameTable(
                name: "Genres",
                newName: "Genres",
                newSchema: "marketplace");

            migrationBuilder.RenameTable(
                name: "GamePlatforms",
                newName: "GamePlatforms",
                newSchema: "marketplace");

            migrationBuilder.RenameTable(
                name: "GameGenres",
                newName: "GameGenres",
                newSchema: "marketplace");

            migrationBuilder.RenameTable(
                name: "MarketPlaceGames",
                newSchema: "marketplace",
                newName: "MarketPlaceGames");
            
            migrationBuilder.RenameTable(
                schema: "marketplace",
                name: "MarketPlaceGames",
                newName: "Games");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Games",
                schema: "marketplace",
                table: "Games",
                column: "game_id");

            migrationBuilder.AddForeignKey(
                name: "FK_GameGenres_Games_genre_id",
                schema: "marketplace",
                table: "GameGenres",
                column: "genre_id",
                principalSchema: "marketplace",
                principalTable: "Games",
                principalColumn: "game_id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_GamePlatforms_Games_platform_id",
                schema: "marketplace",
                table: "GamePlatforms",
                column: "platform_id",
                principalSchema: "marketplace",
                principalTable: "Games",
                principalColumn: "game_id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_OrderItems_Games_game_id",
                schema: "marketplace",
                table: "OrderItems",
                column: "game_id",
                principalSchema: "marketplace",
                principalTable: "Games",
                principalColumn: "game_id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_OrderReviews_Games_game_id",
                schema: "marketplace",
                table: "OrderReviews",
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
                name: "FK_GameGenres_Games_genre_id",
                schema: "marketplace",
                table: "GameGenres");

            migrationBuilder.DropForeignKey(
                name: "FK_GamePlatforms_Games_platform_id",
                schema: "marketplace",
                table: "GamePlatforms");

            migrationBuilder.DropForeignKey(
                name: "FK_OrderItems_Games_game_id",
                schema: "marketplace",
                table: "OrderItems");

            migrationBuilder.DropForeignKey(
                name: "FK_OrderReviews_Games_game_id",
                schema: "marketplace",
                table: "OrderReviews");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Games",
                schema: "marketplace",
                table: "Games");

            migrationBuilder.RenameTable(
                name: "Platforms",
                schema: "marketplace",
                newName: "Platforms");

            migrationBuilder.RenameTable(
                name: "Orders",
                schema: "marketplace",
                newName: "Orders");

            migrationBuilder.RenameTable(
                name: "OrderReviews",
                schema: "marketplace",
                newName: "OrderReviews");

            migrationBuilder.RenameTable(
                name: "OrderItems",
                schema: "marketplace",
                newName: "OrderItems");

            migrationBuilder.RenameTable(
                name: "Genres",
                schema: "marketplace",
                newName: "Genres");

            migrationBuilder.RenameTable(
                name: "GamePlatforms",
                schema: "marketplace",
                newName: "GamePlatforms");

            migrationBuilder.RenameTable(
                name: "GameGenres",
                schema: "marketplace",
                newName: "GameGenres");

            migrationBuilder.RenameTable(
                name: "Games",
                schema: "marketplace",
                newName: "MarketPlaceGames");

            migrationBuilder.AddPrimaryKey(
                name: "PK_MarketPlaceGames",
                table: "MarketPlaceGames",
                column: "game_id");

            migrationBuilder.AddForeignKey(
                name: "FK_GameGenres_MarketPlaceGames_genre_id",
                table: "GameGenres",
                column: "genre_id",
                principalTable: "MarketPlaceGames",
                principalColumn: "game_id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_GamePlatforms_MarketPlaceGames_platform_id",
                table: "GamePlatforms",
                column: "platform_id",
                principalTable: "MarketPlaceGames",
                principalColumn: "game_id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_OrderItems_MarketPlaceGames_game_id",
                table: "OrderItems",
                column: "game_id",
                principalTable: "MarketPlaceGames",
                principalColumn: "game_id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_OrderReviews_MarketPlaceGames_game_id",
                table: "OrderReviews",
                column: "game_id",
                principalTable: "MarketPlaceGames",
                principalColumn: "game_id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
