using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ESOF.WebApp.DBLayer.Migrations
{
    /// <inheritdoc />
    public partial class Create_Game : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Games",
                columns: table => new
                {
                    gameId = table.Column<Guid>(type: "uuid", nullable: false),
                    name = table.Column<string>(type: "text", nullable: false),
                    releaseDate = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    developer = table.Column<string>(type: "text", nullable: false),
                    publisher = table.Column<string>(type: "text", nullable: false),
                    description = table.Column<string>(type: "text", nullable: false),
                    price = table.Column<float>(type: "real", nullable: false),
                    os = table.Column<string>(type: "text", nullable: false),
                    processor = table.Column<string>(type: "text", nullable: false),
                    memory = table.Column<string>(type: "text", nullable: false),
                    graphics = table.Column<string>(type: "text", nullable: false),
                    network = table.Column<string>(type: "text", nullable: false),
                    storage = table.Column<string>(type: "text", nullable: false),
                    additionalNotes = table.Column<string>(type: "text", nullable: false),
                    genres = table.Column<int[]>(type: "integer[]", nullable: false),
                    categories = table.Column<int[]>(type: "integer[]", nullable: false),
                    consoles = table.Column<int[]>(type: "integer[]", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Games", x => x.gameId);
                });

            migrationBuilder.CreateTable(
                name: "Shops",
                columns: table => new
                {
                    gameOfMonthId = table.Column<Guid>(type: "uuid", nullable: false),
                    date = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    gameId = table.Column<Guid>(type: "uuid", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Shops", x => x.gameOfMonthId);
                    table.ForeignKey(
                        name: "FK_Shops_Games_gameId",
                        column: x => x.gameId,
                        principalTable: "Games",
                        principalColumn: "gameId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Shops_gameId",
                table: "Shops",
                column: "gameId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Shops");

            migrationBuilder.DropTable(
                name: "Games");
        }
    }
}
