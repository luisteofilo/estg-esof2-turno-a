using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ESOF.WebApp.DBLayer.Migrations
{
    /// <inheritdoc />
    public partial class UpdateRoms : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Roms_GameId",
                table: "Roms");

            migrationBuilder.CreateIndex(
                name: "IX_Roms_GameId",
                table: "Roms",
                column: "GameId",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Roms_GameId",
                table: "Roms");

            migrationBuilder.CreateIndex(
                name: "IX_Roms_GameId",
                table: "Roms",
                column: "GameId");
        }
    }
}