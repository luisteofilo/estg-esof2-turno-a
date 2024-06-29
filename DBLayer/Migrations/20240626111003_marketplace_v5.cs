using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ESOF.WebApp.DBLayer.Migrations
{
    /// <inheritdoc />
    public partial class marketplace_v5 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_OrderItems_Orders_order_id",
                schema: "marketplace",
                table: "OrderItems");

            migrationBuilder.DropForeignKey(
                name: "FK_OrderReviews_Orders_order_id",
                schema: "marketplace",
                table: "OrderReviews");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Orders",
                schema: "marketplace",
                table: "Orders");

            migrationBuilder.AlterColumn<Guid>(
                name: "order_id",
                schema: "marketplace",
                table: "Orders",
                type: "uuid",
                nullable: false,
                defaultValueSql: "gen_random_uuid()",
                oldClrType: typeof(Guid),
                oldType: "uuid");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Orders",
                schema: "marketplace",
                table: "Orders",
                column: "order_id");

            migrationBuilder.CreateIndex(
                name: "IX_Orders_user_id",
                schema: "marketplace",
                table: "Orders",
                column: "user_id");

            migrationBuilder.AddForeignKey(
                name: "FK_OrderItems_Orders_order_id",
                schema: "marketplace",
                table: "OrderItems",
                column: "order_id",
                principalSchema: "marketplace",
                principalTable: "Orders",
                principalColumn: "order_id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_OrderReviews_Orders_order_id",
                schema: "marketplace",
                table: "OrderReviews",
                column: "order_id",
                principalSchema: "marketplace",
                principalTable: "Orders",
                principalColumn: "order_id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_OrderItems_Orders_order_id",
                schema: "marketplace",
                table: "OrderItems");

            migrationBuilder.DropForeignKey(
                name: "FK_OrderReviews_Orders_order_id",
                schema: "marketplace",
                table: "OrderReviews");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Orders",
                schema: "marketplace",
                table: "Orders");

            migrationBuilder.DropIndex(
                name: "IX_Orders_user_id",
                schema: "marketplace",
                table: "Orders");

            migrationBuilder.AlterColumn<Guid>(
                name: "order_id",
                schema: "marketplace",
                table: "Orders",
                type: "uuid",
                nullable: false,
                oldClrType: typeof(Guid),
                oldType: "uuid",
                oldDefaultValueSql: "gen_random_uuid()");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Orders",
                schema: "marketplace",
                table: "Orders",
                column: "user_id");

            migrationBuilder.AddForeignKey(
                name: "FK_OrderItems_Orders_order_id",
                schema: "marketplace",
                table: "OrderItems",
                column: "order_id",
                principalSchema: "marketplace",
                principalTable: "Orders",
                principalColumn: "user_id",
                onDelete: ReferentialAction.Cascade);

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
    }
}
