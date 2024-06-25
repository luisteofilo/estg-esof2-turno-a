using ESOF.WebApp.DBLayer.Helpers;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ESOF.WebApp.DBLayer.Migrations
{
    /// <inheritdoc />
    public partial class SpeedRunsData : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
                // Adding roles
            var adminRoleId = Guid.NewGuid();
            var normalRoleId = Guid.NewGuid();

            migrationBuilder.InsertData(
                table: "Roles",
                columns: new[] { "RoleId", "Name" },
                values: new object[,]
                {
                    { adminRoleId, "Admin" },
                    { normalRoleId, "Normal" }
                });

            // Adding permissions
            var sampleFeature1PermissionId = Guid.NewGuid();
            var sampleFeature2PermissionId = Guid.NewGuid();
            var sampleAdminFeaturePermissionId = Guid.NewGuid();

            migrationBuilder.InsertData(
                table: "Permissions",
                columns: new[] { "PermissionId", "Name" },
                values: new object[,]
                {
                    { sampleFeature1PermissionId, "Sample Feature 1" },
                    { sampleFeature2PermissionId, "Sample Feature 2" },
                    { sampleAdminFeaturePermissionId, "Sample Admin Feature" }
                });

            // Adding role-permissions
            migrationBuilder.InsertData(
                table: "RolePermissions",
                columns: new[] { "RoleId", "PermissionId" },
                values: new object[,]
                {
                    { adminRoleId, sampleFeature1PermissionId },
                    { adminRoleId, sampleFeature2PermissionId },
                    { adminRoleId, sampleAdminFeaturePermissionId },
                    { normalRoleId, sampleFeature1PermissionId },
                    { normalRoleId, sampleFeature2PermissionId }
                });

            // Adding users
            var adminUserId = Guid.NewGuid();
            var normalUserId = Guid.NewGuid();
            PasswordHelper.CreatePasswordHash("root", out byte[] adminPasswordHash, out byte[] adminPasswordSalt);
            PasswordHelper.CreatePasswordHash("normal", out byte[] normalPasswordHash, out byte[] normalPasswordSalt);

            migrationBuilder.InsertData(
                table: "Users",
                columns: new[] { "UserId", "Email", "PasswordHash", "PasswordSalt" },
                values: new object[,]
                {
                    { adminUserId, "root@example.com", adminPasswordHash, adminPasswordSalt },
                    { normalUserId, "normal@example.com", normalPasswordHash, normalPasswordSalt }
                });

            // Adding user-roles
            migrationBuilder.InsertData(
                table: "UserRoles",
                columns: new[] { "UserId", "RoleId" },
                values: new object[,]
                {
                    { adminUserId, adminRoleId },
                    { normalUserId, normalRoleId }
                });
            
            var gameId = Guid.NewGuid();

            migrationBuilder.InsertData(
                table: "Games",
                columns: new[] { "game_id", "name", "description", "stock", "price", "release_date" },
                values: new object[] { gameId, "Roblox", "Descrição do Jogo", 100, 59.99, DateTime.UtcNow }
            );

            var categoryId = Guid.NewGuid();

            migrationBuilder.InsertData(
                table: "SpeedrunCategories",
                columns: new[] { "categoryID", "gameID", "creationDate", "categoryName", "categoryDescription", "categoryRules" },
                values: new object[] { categoryId, gameId, DateTime.UtcNow, "Categoria Exemplo", "Descrição da Categoria Exemplo", "Regras da Categoria Exemplo" }
            );

            var moderatorId = Guid.NewGuid();
            var userId = adminUserId;

            migrationBuilder.InsertData(
                table: "SpeedrunModerators",
                columns: new[] { "moderatorID", "userID", "gameID", "roleGivenDate" },
                values: new object[] { moderatorId, userId, gameId, DateTime.UtcNow }
            );

            var runId = Guid.NewGuid();
            var playerId = normalUserId;
            migrationBuilder.InsertData(
                table: "SpeedrunRuns",
                columns: new[] { "runID", "playerID", "categoryID", "runTime", "SubmissionDate", "verified", "verifierID", "videoLink" },
                values: new object[] { runId, playerId, categoryId, 3600, DateTime.UtcNow, false, null, "https://www.example.com" }
            );
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql("DELETE FROM UserRoles");
            migrationBuilder.Sql("DELETE FROM Users");
            migrationBuilder.Sql("DELETE FROM RolePermissions");
            migrationBuilder.Sql("DELETE FROM Permissions");
            migrationBuilder.Sql("DELETE FROM Roles");
            migrationBuilder.Sql("DELETE FROM Games");
            migrationBuilder.Sql("DELETE FROM SpeedrunCategories");
            migrationBuilder.Sql("DELETE FROM SpeedrunModerators");
            migrationBuilder.Sql("DELETE FROM SpeedrunRuns");
        }
    }
}
