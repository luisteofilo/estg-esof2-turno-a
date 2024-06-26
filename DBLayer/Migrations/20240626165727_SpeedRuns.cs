using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ESOF.WebApp.DBLayer.Migrations
{
    /// <inheritdoc />
    public partial class SpeedRuns : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {

            migrationBuilder.CreateTable(
                name: "SpeedrunCategories",
                columns: table => new
                {
                    categoryID = table.Column<Guid>(type: "uuid", nullable: false, defaultValueSql: "gen_random_uuid()"),
                    gameID = table.Column<Guid>(type: "uuid", nullable: false),
                    creationDate = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false),
                    categoryName = table.Column<string>(type: "text", nullable: false),
                    categoryDescription = table.Column<string>(type: "text", nullable: false),
                    categoryRules = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SpeedrunCategories", x => x.categoryID);
                    table.ForeignKey(
                        name: "FK_SpeedrunCategories_Games_gameID",
                        column: x => x.gameID,
                        principalTable: "Games",
                        principalColumn: "GameId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "SpeedrunModerators",
                columns: table => new
                {
                    moderatorID = table.Column<Guid>(type: "uuid", nullable: false, defaultValueSql: "gen_random_uuid()"),
                    userID = table.Column<Guid>(type: "uuid", nullable: false),
                    gameID = table.Column<Guid>(type: "uuid", nullable: false),
                    roleGivenDate = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SpeedrunModerators", x => x.moderatorID);
                    table.ForeignKey(
                        name: "FK_SpeedrunModerators_Games_gameID",
                        column: x => x.gameID,
                        principalTable: "Games",
                        principalColumn: "GameId",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_SpeedrunModerators_Users_userID",
                        column: x => x.userID,
                        principalTable: "Users",
                        principalColumn: "UserId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "SpeedrunRuns",
                columns: table => new
                {
                    runID = table.Column<Guid>(type: "uuid", nullable: false, defaultValueSql: "gen_random_uuid()"),
                    playerID = table.Column<Guid>(type: "uuid", nullable: false),
                    categoryID = table.Column<Guid>(type: "uuid", nullable: false),
                    runTime = table.Column<int>(type: "integer", nullable: false),
                    SubmissionDate = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false),
                    verified = table.Column<bool>(type: "boolean", nullable: false, defaultValue: false),
                    verifierID = table.Column<Guid>(type: "uuid", nullable: true),
                    videoLink = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SpeedrunRuns", x => x.runID);
                    table.ForeignKey(
                        name: "FK_SpeedrunRuns_SpeedrunCategories_categoryID",
                        column: x => x.categoryID,
                        principalTable: "SpeedrunCategories",
                        principalColumn: "categoryID",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_SpeedrunRuns_SpeedrunModerators_verifierID",
                        column: x => x.verifierID,
                        principalTable: "SpeedrunModerators",
                        principalColumn: "moderatorID");
                    table.ForeignKey(
                        name: "FK_SpeedrunRuns_Users_playerID",
                        column: x => x.playerID,
                        principalTable: "Users",
                        principalColumn: "UserId",
                        onDelete: ReferentialAction.Cascade);
                });
            
            migrationBuilder.CreateIndex(
                name: "IX_SpeedrunCategories_gameID",
                table: "SpeedrunCategories",
                column: "gameID");

            migrationBuilder.CreateIndex(
                name: "IX_SpeedrunModerators_gameID",
                table: "SpeedrunModerators",
                column: "gameID");

            migrationBuilder.CreateIndex(
                name: "IX_SpeedrunModerators_userID",
                table: "SpeedrunModerators",
                column: "userID");

            migrationBuilder.CreateIndex(
                name: "IX_SpeedrunRuns_categoryID",
                table: "SpeedrunRuns",
                column: "categoryID");

            migrationBuilder.CreateIndex(
                name: "IX_SpeedrunRuns_playerID",
                table: "SpeedrunRuns",
                column: "playerID");

            migrationBuilder.CreateIndex(
                name: "IX_SpeedrunRuns_verifierID",
                table: "SpeedrunRuns",
                column: "verifierID");
            
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "RolePermissions");

            migrationBuilder.DropTable(
                name: "Shop");

            migrationBuilder.DropTable(
                name: "SpeedrunRuns");

            migrationBuilder.DropTable(
                name: "UserRoles");

            migrationBuilder.DropTable(
                name: "Permissions");

            migrationBuilder.DropTable(
                name: "SpeedrunCategories");

            migrationBuilder.DropTable(
                name: "SpeedrunModerators");

            migrationBuilder.DropTable(
                name: "Roles");

            migrationBuilder.DropTable(
                name: "Games");

            migrationBuilder.DropTable(
                name: "Users");
        }
    }
}
