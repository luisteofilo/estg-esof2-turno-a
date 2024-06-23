using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ESOF.WebApp.DBLayer.Migrations
{
    /// <inheritdoc />
    public partial class TableScoreFix : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropPrimaryKey(
                name: "PK_TestUserScores",
                table: "TestUserScores");

            migrationBuilder.AddColumn<Guid>(
                name: "ScoreId",
                table: "TestUserScores",
                type: "uuid",
                nullable: false,
                defaultValueSql: "gen_random_uuid()");

            migrationBuilder.AlterColumn<long>(
                name: "RequiredScore",
                table: "Achievements",
                type: "bigint",
                nullable: false,
                oldClrType: typeof(int),
                oldType: "integer");

            migrationBuilder.AddPrimaryKey(
                name: "PK_TestUserScores",
                table: "TestUserScores",
                column: "ScoreId");

            migrationBuilder.CreateIndex(
                name: "IX_TestUserScores_UserId",
                table: "TestUserScores",
                column: "UserId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropPrimaryKey(
                name: "PK_TestUserScores",
                table: "TestUserScores");

            migrationBuilder.DropIndex(
                name: "IX_TestUserScores_UserId",
                table: "TestUserScores");

            migrationBuilder.DropColumn(
                name: "ScoreId",
                table: "TestUserScores");

            migrationBuilder.AlterColumn<int>(
                name: "RequiredScore",
                table: "Achievements",
                type: "integer",
                nullable: false,
                oldClrType: typeof(long),
                oldType: "bigint");

            migrationBuilder.AddPrimaryKey(
                name: "PK_TestUserScores",
                table: "TestUserScores",
                column: "UserId");
        }
    }
}
