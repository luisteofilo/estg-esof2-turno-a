using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ESOF.WebApp.DBLayer.Migrations
{
    /// <inheritdoc />
    public partial class TestScoreFix : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropPrimaryKey(
                name: "PK_TestUserScores",
                table: "TestUserScores");

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

            migrationBuilder.AddPrimaryKey(
                name: "PK_TestUserScores",
                table: "TestUserScores",
                column: "UserId");
        }
    }
}
