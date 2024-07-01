using ESOF.WebApp.DBLayer.Helpers;
using Microsoft.EntityFrameworkCore.Migrations;
using System;
using System.Collections.Generic;

#nullable disable

namespace ESOF.WebApp.DBLayer.Migrations
{
    /// <inheritdoc />
    public partial class PopulateDB : Migration
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
            var normalUserId1 = new Guid("addcd892-2ffa-417b-ad05-abe1610a5fe9");
            var normalUserId2 = Guid.NewGuid();
            var normalUserId3 = Guid.NewGuid();

            PasswordHelper.CreatePasswordHash("root", out byte[] adminPasswordHash, out byte[] adminPasswordSalt);
            PasswordHelper.CreatePasswordHash("johndoe", out byte[] normalPasswordHash1, out byte[] normalPasswordSalt1);
            PasswordHelper.CreatePasswordHash("rachelpark", out byte[] normalPasswordHash2, out byte[] normalPasswordSalt2);
            PasswordHelper.CreatePasswordHash("loremipsum", out byte[] normalPasswordHash3, out byte[] normalPasswordSalt3);

            migrationBuilder.InsertData(
                table: "Users",
                columns: new[] { "UserId", "Username", "Email", "PasswordHash", "PasswordSalt" },
                values: new object[,]
                {
                    { adminUserId, "root", "root@example.com", adminPasswordHash, adminPasswordSalt },
                    { normalUserId1, "johndoe", "johndoe@example.com", normalPasswordHash1, normalPasswordSalt1 },
                    { normalUserId2, "rachelpark", "rachelpark@example.com", normalPasswordHash2, normalPasswordSalt2 },
                    { normalUserId3, "loremipsum", "loremipsum@example.com", normalPasswordHash3, normalPasswordSalt3 }
                });

            // Adding user-roles
            migrationBuilder.InsertData(
                table: "UserRoles",
                columns: new[] { "UserId", "RoleId" },
                values: new object[,]
                {
                    { adminUserId, adminRoleId },
                    { normalUserId1, normalRoleId },
                    { normalUserId2, normalRoleId },
                    { normalUserId3, normalRoleId }
                });

            // Adding games
            var gameId1 = Guid.NewGuid();
            var gameId2 = Guid.NewGuid();
            var gameId3 = Guid.NewGuid();
            var gameId4 = Guid.NewGuid();

            List<int> genres = new List<int> { 1, 2 };
            List<int> categories = new List<int> { 1, 2 };
            List<int> consoles = new List<int> { 1, 2 };

            migrationBuilder.InsertData(
                table: "Games",
                columns: new[] { "GameId", "Name", "ReleaseDate", "Url_Image", "DeveloperID", "Publisher", "Description", "Price", "Genres", "Categories", "Consoles" },
                values: new object[,]
                {
                    { gameId1, "The Legend of Zelda: Breath of the Wild", new DateTime(2017, 3, 3).ToUniversalTime(), "https://example.com/zelda.png", normalUserId1, "Nintendo", "An action-adventure game set in an open world.", 59.99, genres, categories, consoles },
                    { gameId2, "Minecraft", new DateTime(2011, 11, 18).ToUniversalTime(), "https://example.com/minecraft.png", normalUserId2, "Mojang", "A sandbox game that allows players to build and explore virtual worlds.", 26.95, genres, categories, consoles },
                    { gameId3, "Stardew Valley", new DateTime(2016, 2, 26).ToUniversalTime(), "https://example.com/stardew.png", normalUserId1, "ConcernedApe", "An open-ended country-life RPG.", 14.99, genres, categories, consoles },
                    { gameId4, "Super Mario Bros.", new DateTime(1987, 5, 15).ToUniversalTime(), "https://example.com/mario.png", normalUserId3, "Nintendo", "The classic Mario plataform game from the NES", 0, genres, categories, consoles }
                });

            migrationBuilder.InsertData(
                schema: "marketplace",
                table: "Games",
                columns: new[] { "game_id", "name", "release_date", "description", "price", "stock" },
                values: new object[,]
                {
                    { gameId1, "The Legend of Zelda: Breath of the Wild", new DateTime(2017, 3, 3).ToUniversalTime(), "An action-adventure game set in an open world.", 59.99, 10 },
                    { gameId2, "Minecraft", new DateTime(2011, 11, 18).ToUniversalTime(), "A sandbox game that allows players to build and explore virtual worlds.", 26.95, 60 },
                    { gameId3, "Stardew Valley", new DateTime(2016, 2, 26).ToUniversalTime(), "An open-ended country-life RPG.", 14.99, 4 },
                    { gameId4, "Super Mario Bros.", new DateTime(1987, 5, 15).ToUniversalTime(), "The classic Mario plataform game from the NES", 0, 20 }
                });
            
            // Adding speedrun categories, moderators, and runs for each game
            foreach (var gameId in new[] { gameId1, gameId2, gameId3, gameId4 })
            {
                var categoryId = Guid.NewGuid();
                var moderatorId = Guid.NewGuid();
                var runId = Guid.NewGuid();

                migrationBuilder.InsertData(
                    table: "SpeedrunCategories",
                    columns: new[]
                    {
                        "categoryID", "gameID", "creationDate", "categoryName", "categoryDescription", "categoryRules"
                    },
                    values: new object[]
                    {
                        categoryId, gameId, DateTime.UtcNow, "Any%", "Complete the game as fast as possible.",
                        "No restrictions."
                    }
                );

                migrationBuilder.InsertData(
                    table: "SpeedrunModerators",
                    columns: new[] { "moderatorID", "userID", "gameID", "roleGivenDate" },
                    values: new object[] { moderatorId, adminUserId, gameId, DateTime.UtcNow }
                );

                migrationBuilder.InsertData(
                    table: "SpeedrunRuns",
                    columns: new[]
                    {
                        "runID", "playerID", "categoryID", "runTime", "SubmissionDate", "verified", "verifierID",
                        "videoLink"
                    },
                    values: new object[]
                    {
                        runId, normalUserId1, categoryId, 3600, DateTime.UtcNow, false, null, "https://www.example.com"
                    }
                );
            }

            var quest1 = Guid.NewGuid();
            var quest2 = Guid.NewGuid();
            var quest3 = Guid.NewGuid();
            
            migrationBuilder.InsertData(
                schema: "gametok",
                table: "VideoQuests",
                columns: new[] { "VideoQuestId", "GameId", "Description" },
                values: new object[,]
                {
                    { quest1, gameId1, "Kill a Guardian." },
                    { quest2, gameId2, "Show us your minecraft experience." },
                    { quest3, gameId3, "Restore the Community Center in Stardew Valley." }
                });
            
            migrationBuilder.InsertData(
                schema: "gametok",
                table: "Videos",
                columns: new[] { "UserId", "VideoQuestId", "Caption", "VideoPath" },
                values: new object[,]
                {
                    { normalUserId1, quest1,  "This is fun! :D",  "https://loyfxrntjzempmzboipf.supabase.co/storage/v1/object/public/videos/bf57d35a-8978-42a9-a290-17c4c71e367d.mp4"},
                    { normalUserId2, quest1,  "Im so scared!", "https://loyfxrntjzempmzboipf.supabase.co/storage/v1/object/public/videos/293cac2d-dc66-451d-852e-f35460d6826b.mp4" },
                    { normalUserId1, quest2,  "I love this game", "https://loyfxrntjzempmzboipf.supabase.co/storage/v1/object/public/videos/ba48f438-9948-4add-ae14-59c88ddbdea0.mp4" },
                    { normalUserId2, quest2,  "Look at this", "https://loyfxrntjzempmzboipf.supabase.co/storage/v1/object/public/videos/c17ee7bc-cb25-4516-85e7-8f7cc0d769fe.mp4" },
                    { normalUserId1, quest3,  "Easy game", "https://loyfxrntjzempmzboipf.supabase.co/storage/v1/object/public/videos/8bc607bd-5512-45da-98c8-0400cf7a0207.mp4" },
                    { normalUserId2, quest3,  "New record!", "https://loyfxrntjzempmzboipf.supabase.co/storage/v1/object/public/videos/5e3164cd-7bce-405d-88f9-7c233014cbc8.mp4" },
                });
            
            var achievement1 = new Guid("5cc030f2-377f-475b-a4fa-fd20cfa46ff1");
            var achievement2 = Guid.NewGuid();
            
            migrationBuilder.InsertData(
                table: "Achievements",
                columns: new[] { "IdAchievement", "Name", "Description", "RequiredScore" },
                values: new object[,]
                {
                    { achievement1, "Mega Jump", "Jump 1000 times", 1000 },
                    { achievement2, "Flame master", "Burn 10 players", 10 },
                });
            
            migrationBuilder.InsertData(
                table: "PlayerAchievements",
                columns: new[] { "UserId", "AchievementId", "Unlocked" },
                values: new object[,]
                {
                    { normalUserId1, achievement1, DateOnly.FromDateTime(DateTime.UtcNow) },
                    { normalUserId1, achievement2, DateOnly.FromDateTime(DateTime.UtcNow) },
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
        }
    }
}
