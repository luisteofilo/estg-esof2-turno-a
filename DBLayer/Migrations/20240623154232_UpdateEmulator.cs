using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ESOF.WebApp.DBLayer.Migrations
{
    /// <inheritdoc />
    public partial class UpdateEmulator : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<Guid>(
                name: "RomId",
                table: "Roms",
                type: "uuid",
                nullable: false,
                oldClrType: typeof(Guid),
                oldType: "uuid",
                oldDefaultValueSql: "gen_random_uuid()");

            migrationBuilder.CreateTable(
                name: "SaveStates",
                columns: table => new
                {
                    SaveStateId = table.Column<Guid>(type: "uuid", nullable: false),
                    RomId = table.Column<Guid>(type: "uuid", nullable: false),
                    UserId = table.Column<Guid>(type: "uuid", nullable: false),
                    Date = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SaveStates", x => x.SaveStateId);
                    table.ForeignKey(
                        name: "FK_SaveStates_Roms_RomId",
                        column: x => x.RomId,
                        principalTable: "Roms",
                        principalColumn: "RomId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_SaveStates_RomId",
                table: "SaveStates",
                column: "RomId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "SaveStates");

            migrationBuilder.AlterColumn<Guid>(
                name: "RomId",
                table: "Roms",
                type: "uuid",
                nullable: false,
                defaultValueSql: "gen_random_uuid()",
                oldClrType: typeof(Guid),
                oldType: "uuid");
        }
    }
}
