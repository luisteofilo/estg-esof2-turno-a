using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace ESOF.WebApp.DBLayer.Migrations
{
    /// <inheritdoc />
    public partial class UpdateGameEntityAndSeedData : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // Create table if it doesn't exist
            migrationBuilder.CreateTable(
                name: "Games",
                columns: table => new
                {
                    GameId = table.Column<Guid>(nullable: false, defaultValueSql: "gen_random_uuid()"),
                    Name = table.Column<string>(nullable: false),
                    Genre = table.Column<string>(nullable: false),
                    Platform = table.Column<string>(nullable: false),
                    ReleaseDate = table.Column<DateTime>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Games", x => x.GameId);
                });

            // Try to drop indices only if they exist
            migrationBuilder.Sql("DROP INDEX IF EXISTS \"IX_Games_Genre\";");
            migrationBuilder.Sql("DROP INDEX IF EXISTS \"IX_Games_Name\";");
            migrationBuilder.Sql("DROP INDEX IF EXISTS \"IX_Games_Platform\";");

            // Try to delete data only if it exists
            migrationBuilder.Sql("DELETE FROM \"Games\" WHERE \"GameId\" = '1d5e2bd4-4b86-42f7-8938-caa62d5726c8';");
            migrationBuilder.Sql("DELETE FROM \"Games\" WHERE \"GameId\" = '59b1efbb-ac29-4c23-80b1-c11d292338b3';");
            migrationBuilder.Sql("DELETE FROM \"Games\" WHERE \"GameId\" = 'a91c9b36-225c-42be-9a2d-892f41851e32';");
            migrationBuilder.Sql("DELETE FROM \"Games\" WHERE \"GameId\" = 'e13349fd-5666-4b75-9ade-68ef61b2e6b0';");

            // Insert new seed data
            migrationBuilder.InsertData(
                table: "Games",
                columns: new[] { "GameId", "Genre", "Name", "Platform", "ReleaseDate" },
                values: new object[,]
                {
                    { new Guid("1a7a6b24-d8e8-4da3-8801-3b57d4e9d900"), "Strategy", "Game 4", "PC", DateTime.SpecifyKind(DateTime.Parse("2019-09-01"), DateTimeKind.Utc) },
                    { new Guid("32d3845c-9855-4977-a5fb-5e5c945630e9"), "Action", "Game 1", "PC", DateTime.SpecifyKind(DateTime.Parse("2021-01-01"), DateTimeKind.Utc) },
                    { new Guid("95da62b9-00fe-4920-a02b-44d63fac2c64"), "RPG", "Game 3", "Xbox One", DateTime.SpecifyKind(DateTime.Parse("2020-11-10"), DateTimeKind.Utc) },
                    { new Guid("c41a8dbd-f6cb-4f15-8b58-904683022d2b"), "Adventure", "Game 2", "PS4", DateTime.SpecifyKind(DateTime.Parse("2022-05-15"), DateTimeKind.Utc) }
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            // Delete seeded data
            migrationBuilder.Sql("DELETE FROM \"Games\" WHERE \"GameId\" = '1a7a6b24-d8e8-4da3-8801-3b57d4e9d900';");
            migrationBuilder.Sql("DELETE FROM \"Games\" WHERE \"GameId\" = '32d3845c-9855-4977-a5fb-5e5c945630e9';");
            migrationBuilder.Sql("DELETE FROM \"Games\" WHERE \"GameId\" = '95da62b9-00fe-4920-a02b-44d63fac2c64';");
            migrationBuilder.Sql("DELETE FROM \"Games\" WHERE \"GameId\" = 'c41a8dbd-f6cb-4f15-8b58-904683022d2b';");

            // Drop table
            migrationBuilder.DropTable(
                name: "Games");
        }
    }
}
