using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ESOF.WebApp.DBLayer.Migrations
{
    /// <inheritdoc />
    public partial class UpdateBlob : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<string>(
                name: "ROM",
                table: "Roms",
                type: "text",
                nullable: false,
                oldClrType: typeof(byte[]),
                oldType: "bytea");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<byte[]>(
                name: "ROM",
                table: "Roms",
                type: "bytea",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "text");
        }
    }
}
