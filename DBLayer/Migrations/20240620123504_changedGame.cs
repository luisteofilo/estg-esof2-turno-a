using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ESOF.WebApp.DBLayer.Migrations
{
    /// <inheritdoc />
    public partial class changedGame : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_GameGenre_MarketPlaceGames_genre_id",
                table: "GameGenre");

            migrationBuilder.DropForeignKey(
                name: "FK_GamePlatform_MarketPlaceGames_platform_id",
                table: "GamePlatform");

            migrationBuilder.DropForeignKey(
                name: "FK_OrderItem_MarketPlaceGames_game_id",
                table: "OrderItem");

            migrationBuilder.DropTable(
                name: "Review");

            migrationBuilder.DropPrimaryKey(
                name: "PK_MarketPlaceGames",
                table: "MarketPlaceGames");

            migrationBuilder.RenameTable(
                name: "MarketPlaceGames",
                newName: "MarketPlaceGame");

            migrationBuilder.AddColumn<Guid>(
                name: "UserId",
                table: "OrderItem",
                type: "uuid",
                nullable: true);

            migrationBuilder.AddPrimaryKey(
                name: "PK_MarketPlaceGame",
                table: "MarketPlaceGame",
                column: "game_id");

            migrationBuilder.CreateTable(
                name: "OrderReview",
                columns: table => new
                {
                    game_id = table.Column<Guid>(type: "uuid", nullable: false),
                    review_id = table.Column<Guid>(type: "uuid", nullable: false),
                    reviewer_id = table.Column<Guid>(type: "uuid", nullable: false),
                    rating = table.Column<int>(type: "integer", nullable: false),
                    review = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_OrderReview", x => x.game_id);
                    table.ForeignKey(
                        name: "FK_OrderReview_MarketPlaceGame_game_id",
                        column: x => x.game_id,
                        principalTable: "MarketPlaceGame",
                        principalColumn: "game_id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_OrderReview_Users_reviewer_id",
                        column: x => x.reviewer_id,
                        principalTable: "Users",
                        principalColumn: "UserId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_OrderItem_UserId",
                table: "OrderItem",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_OrderReview_reviewer_id",
                table: "OrderReview",
                column: "reviewer_id");

            migrationBuilder.AddForeignKey(
                name: "FK_GameGenre_MarketPlaceGame_genre_id",
                table: "GameGenre",
                column: "genre_id",
                principalTable: "MarketPlaceGame",
                principalColumn: "game_id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_GamePlatform_MarketPlaceGame_platform_id",
                table: "GamePlatform",
                column: "platform_id",
                principalTable: "MarketPlaceGame",
                principalColumn: "game_id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_OrderItem_MarketPlaceGame_game_id",
                table: "OrderItem",
                column: "game_id",
                principalTable: "MarketPlaceGame",
                principalColumn: "game_id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_OrderItem_Users_UserId",
                table: "OrderItem",
                column: "UserId",
                principalTable: "Users",
                principalColumn: "UserId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_GameGenre_MarketPlaceGame_genre_id",
                table: "GameGenre");

            migrationBuilder.DropForeignKey(
                name: "FK_GamePlatform_MarketPlaceGame_platform_id",
                table: "GamePlatform");

            migrationBuilder.DropForeignKey(
                name: "FK_OrderItem_MarketPlaceGame_game_id",
                table: "OrderItem");

            migrationBuilder.DropForeignKey(
                name: "FK_OrderItem_Users_UserId",
                table: "OrderItem");

            migrationBuilder.DropTable(
                name: "OrderReview");

            migrationBuilder.DropIndex(
                name: "IX_OrderItem_UserId",
                table: "OrderItem");

            migrationBuilder.DropPrimaryKey(
                name: "PK_MarketPlaceGame",
                table: "MarketPlaceGame");

            migrationBuilder.DropColumn(
                name: "UserId",
                table: "OrderItem");

            migrationBuilder.RenameTable(
                name: "MarketPlaceGame",
                newName: "MarketPlaceGames");

            migrationBuilder.AddPrimaryKey(
                name: "PK_MarketPlaceGames",
                table: "MarketPlaceGames",
                column: "game_id");

            migrationBuilder.CreateTable(
                name: "Review",
                columns: table => new
                {
                    game_id = table.Column<Guid>(type: "uuid", nullable: false),
                    rating = table.Column<int>(type: "integer", nullable: false),
                    review = table.Column<string>(type: "text", nullable: false),
                    review_id = table.Column<Guid>(type: "uuid", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Review", x => x.game_id);
                    table.ForeignKey(
                        name: "FK_Review_MarketPlaceGames_game_id",
                        column: x => x.game_id,
                        principalTable: "MarketPlaceGames",
                        principalColumn: "game_id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.AddForeignKey(
                name: "FK_GameGenre_MarketPlaceGames_genre_id",
                table: "GameGenre",
                column: "genre_id",
                principalTable: "MarketPlaceGames",
                principalColumn: "game_id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_GamePlatform_MarketPlaceGames_platform_id",
                table: "GamePlatform",
                column: "platform_id",
                principalTable: "MarketPlaceGames",
                principalColumn: "game_id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_OrderItem_MarketPlaceGames_game_id",
                table: "OrderItem",
                column: "game_id",
                principalTable: "MarketPlaceGames",
                principalColumn: "game_id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
