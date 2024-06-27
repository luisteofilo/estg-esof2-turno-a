using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ESOF.WebApp.DBLayer.Migrations
{
    /// <inheritdoc />
    public partial class marketplace_v3 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_OrderReviews_Games_game_id",
                schema: "marketplace",
                table: "OrderReviews");

            migrationBuilder.DropPrimaryKey(
                name: "PK_OrderReviews",
                schema: "marketplace",
                table: "OrderReviews");

            migrationBuilder.DropIndex(
                name: "IX_OrderReviews_reviewer_id",
                schema: "marketplace",
                table: "OrderReviews");

            migrationBuilder.DropColumn(
                name: "game_id",
                schema: "marketplace",
                table: "OrderReviews");

            migrationBuilder.RenameColumn(
                name: "review_id",
                schema: "marketplace",
                table: "OrderReviews",
                newName: "order_id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_OrderReviews",
                schema: "marketplace",
                table: "OrderReviews",
                column: "reviewer_id");

            migrationBuilder.CreateIndex(
                name: "IX_OrderReviews_order_id",
                schema: "marketplace",
                table: "OrderReviews",
                column: "order_id");

            migrationBuilder.AddForeignKey(
                name: "FK_OrderReviews_Orders_order_id",
                schema: "marketplace",
                table: "OrderReviews",
                column: "order_id",
                principalSchema: "marketplace",
                principalTable: "Orders",
                principalColumn: "user_id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_OrderReviews_Orders_order_id",
                schema: "marketplace",
                table: "OrderReviews");

            migrationBuilder.DropPrimaryKey(
                name: "PK_OrderReviews",
                schema: "marketplace",
                table: "OrderReviews");

            migrationBuilder.DropIndex(
                name: "IX_OrderReviews_order_id",
                schema: "marketplace",
                table: "OrderReviews");

            migrationBuilder.RenameColumn(
                name: "order_id",
                schema: "marketplace",
                table: "OrderReviews",
                newName: "review_id");

            migrationBuilder.AddColumn<Guid>(
                name: "game_id",
                schema: "marketplace",
                table: "OrderReviews",
                type: "uuid",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.AddPrimaryKey(
                name: "PK_OrderReviews",
                schema: "marketplace",
                table: "OrderReviews",
                column: "game_id");

            migrationBuilder.CreateIndex(
                name: "IX_OrderReviews_reviewer_id",
                schema: "marketplace",
                table: "OrderReviews",
                column: "reviewer_id");

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
    }
}
