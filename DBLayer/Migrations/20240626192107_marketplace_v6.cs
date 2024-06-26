using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ESOF.WebApp.DBLayer.Migrations
{
    /// <inheritdoc />
    public partial class marketplace_v6 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropPrimaryKey(
                name: "PK_GameGenres",
                schema: "marketplace",
                table: "GameGenres");

            migrationBuilder.AlterColumn<Guid>(
                name: "game_id",
                schema: "marketplace",
                table: "GameGenres",
                type: "uuid",
                nullable: false,
                oldClrType: typeof(Guid),
                oldType: "uuid")
                .Annotation("Relational:ColumnOrder", 0);

            migrationBuilder.AlterColumn<Guid>(
                name: "genre_id",
                schema: "marketplace",
                table: "GameGenres",
                type: "uuid",
                nullable: false,
                oldClrType: typeof(Guid),
                oldType: "uuid")
                .Annotation("Relational:ColumnOrder", 1);

            migrationBuilder.AddPrimaryKey(
                name: "PK_GameGenres",
                schema: "marketplace",
                table: "GameGenres",
                columns: new[] { "game_id", "genre_id" });

            migrationBuilder.CreateIndex(
                name: "IX_GameGenres_genre_id",
                schema: "marketplace",
                table: "GameGenres",
                column: "genre_id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropPrimaryKey(
                name: "PK_GameGenres",
                schema: "marketplace",
                table: "GameGenres");

            migrationBuilder.DropIndex(
                name: "IX_GameGenres_genre_id",
                schema: "marketplace",
                table: "GameGenres");

            migrationBuilder.AlterColumn<Guid>(
                name: "genre_id",
                schema: "marketplace",
                table: "GameGenres",
                type: "uuid",
                nullable: false,
                oldClrType: typeof(Guid),
                oldType: "uuid")
                .OldAnnotation("Relational:ColumnOrder", 1);

            migrationBuilder.AlterColumn<Guid>(
                name: "game_id",
                schema: "marketplace",
                table: "GameGenres",
                type: "uuid",
                nullable: false,
                oldClrType: typeof(Guid),
                oldType: "uuid")
                .OldAnnotation("Relational:ColumnOrder", 0);

            migrationBuilder.AddPrimaryKey(
                name: "PK_GameGenres",
                schema: "marketplace",
                table: "GameGenres",
                column: "genre_id");
        }
    }
}
