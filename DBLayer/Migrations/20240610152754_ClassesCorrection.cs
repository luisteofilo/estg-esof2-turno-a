using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ESOF.WebApp.DBLayer.Migrations
{
    /// <inheritdoc />
    public partial class ClassesCorrection : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "storage",
                table: "Games",
                newName: "Storage");

            migrationBuilder.RenameColumn(
                name: "releaseDate",
                table: "Games",
                newName: "ReleaseDate");

            migrationBuilder.RenameColumn(
                name: "publisher",
                table: "Games",
                newName: "Publisher");

            migrationBuilder.RenameColumn(
                name: "processor",
                table: "Games",
                newName: "Processor");

            migrationBuilder.RenameColumn(
                name: "price",
                table: "Games",
                newName: "Price");

            migrationBuilder.RenameColumn(
                name: "os",
                table: "Games",
                newName: "Os");

            migrationBuilder.RenameColumn(
                name: "network",
                table: "Games",
                newName: "Network");

            migrationBuilder.RenameColumn(
                name: "name",
                table: "Games",
                newName: "Name");

            migrationBuilder.RenameColumn(
                name: "memory",
                table: "Games",
                newName: "Memory");

            migrationBuilder.RenameColumn(
                name: "graphics",
                table: "Games",
                newName: "Graphics");

            migrationBuilder.RenameColumn(
                name: "genres",
                table: "Games",
                newName: "Genres");

            migrationBuilder.RenameColumn(
                name: "developer",
                table: "Games",
                newName: "DeveloperID");

            migrationBuilder.RenameColumn(
                name: "description",
                table: "Games",
                newName: "Description");

            migrationBuilder.RenameColumn(
                name: "consoles",
                table: "Games",
                newName: "Consoles");

            migrationBuilder.RenameColumn(
                name: "categories",
                table: "Games",
                newName: "Categories");

            migrationBuilder.RenameColumn(
                name: "additionalNotes",
                table: "Games",
                newName: "AdditionalNotes");

            migrationBuilder.AlterColumn<Guid>(
                name: "GameOfMonthId",
                table: "Shop",
                type: "uuid",
                nullable: false,
                defaultValueSql: "gen_random_uuid()",
                oldClrType: typeof(Guid),
                oldType: "uuid");

            migrationBuilder.AlterColumn<Guid>(
                name: "GameId",
                table: "Games",
                type: "uuid",
                nullable: false,
                defaultValueSql: "gen_random_uuid()",
                oldClrType: typeof(Guid),
                oldType: "uuid");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Storage",
                table: "Games",
                newName: "storage");

            migrationBuilder.RenameColumn(
                name: "ReleaseDate",
                table: "Games",
                newName: "releaseDate");

            migrationBuilder.RenameColumn(
                name: "Publisher",
                table: "Games",
                newName: "publisher");

            migrationBuilder.RenameColumn(
                name: "Processor",
                table: "Games",
                newName: "processor");

            migrationBuilder.RenameColumn(
                name: "Price",
                table: "Games",
                newName: "price");

            migrationBuilder.RenameColumn(
                name: "Os",
                table: "Games",
                newName: "os");

            migrationBuilder.RenameColumn(
                name: "Network",
                table: "Games",
                newName: "network");

            migrationBuilder.RenameColumn(
                name: "Name",
                table: "Games",
                newName: "name");

            migrationBuilder.RenameColumn(
                name: "Memory",
                table: "Games",
                newName: "memory");

            migrationBuilder.RenameColumn(
                name: "Graphics",
                table: "Games",
                newName: "graphics");

            migrationBuilder.RenameColumn(
                name: "Genres",
                table: "Games",
                newName: "genres");

            migrationBuilder.RenameColumn(
                name: "Developer",
                table: "Games",
                newName: "developer");

            migrationBuilder.RenameColumn(
                name: "Description",
                table: "Games",
                newName: "description");

            migrationBuilder.RenameColumn(
                name: "Consoles",
                table: "Games",
                newName: "consoles");

            migrationBuilder.RenameColumn(
                name: "Categories",
                table: "Games",
                newName: "categories");

            migrationBuilder.RenameColumn(
                name: "AdditionalNotes",
                table: "Games",
                newName: "additionalNotes");

            migrationBuilder.AlterColumn<Guid>(
                name: "GameOfMonthId",
                table: "Shop",
                type: "uuid",
                nullable: false,
                oldClrType: typeof(Guid),
                oldType: "uuid",
                oldDefaultValueSql: "gen_random_uuid()");

            migrationBuilder.AlterColumn<Guid>(
                name: "GameId",
                table: "Games",
                type: "uuid",
                nullable: false,
                oldClrType: typeof(Guid),
                oldType: "uuid",
                oldDefaultValueSql: "gen_random_uuid()");
        }
    }
}
