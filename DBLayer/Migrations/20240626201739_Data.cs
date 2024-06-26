using ESOF.WebApp.DBLayer.Helpers;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ESOF.WebApp.DBLayer.Migrations
{
    /// <inheritdoc />
    public partial class Data : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            var GTAid = Guid.NewGuid();
            var RDRid = Guid.NewGuid();
            var LOLid = Guid.NewGuid();
            var LoZid = Guid.NewGuid();
            var CS2id = Guid.NewGuid();
            
            migrationBuilder.InsertData(
                table: "Games",
                columns: new[] { "GameId", "Name" },
                values: new object[,]
                {
                    { GTAid,"Grand Theft Auto V" },
                    { RDRid,"Red Dead Redemption 2" },
                    { LOLid,"League of Legends" },
                    { LoZid,"Legends of Zelda" },
                    { CS2id,"Counter Strike 2" }
                });

            
            var CriticoId = Guid.NewGuid();
            var UserId = Guid.NewGuid();
            PasswordHelper.CreatePasswordHash("root", out byte[] adminPasswordHash, out byte[] adminPasswordSalt);
            PasswordHelper.CreatePasswordHash("normal", out byte[] normalPasswordHash, out byte[] normalPasswordSalt);
            
            
            migrationBuilder.InsertData(
                table: "Users",
                columns: new[] { "UserId", "Email", "PasswordHash", "PasswordSalt", "tipo_user" },
                values: new object[,]
                {
                    { CriticoId, "12345@gmail.com", adminPasswordHash, adminPasswordSalt, 1 },
                    { UserId, "54321@gmail.com", normalPasswordHash, normalPasswordSalt, 0 }
                });


            migrationBuilder.InsertData(
                table: "Reviews",
                columns: new[] { "Comment", "Evaluation", "UserId", "GameId" },
                values: new object[,]
                {
                    {"Muito bom", 8, UserId, GTAid},
                    {"Bastante bom", 9, UserId, LOLid},
                    {"Perfeito!!", 10, UserId, LOLid},
                    {"Nao muito bom", 4, UserId, RDRid},
                    {"Da para jogar", 6, CriticoId, LoZid},
                    {"Divertido!", 8, CriticoId, CS2id},
                    {"Mediano", 5, CriticoId, LOLid},
                    {"Muito mau", 2, CriticoId, GTAid},
                });


        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql("DELETE FROM Reviews");
            migrationBuilder.Sql("DELETE FROM Games");
            
            migrationBuilder.Sql("DELETE FROM UserRoles");
            migrationBuilder.Sql("DELETE FROM Users");
            migrationBuilder.Sql("DELETE FROM RolePermissions");
            migrationBuilder.Sql("DELETE FROM Permissions");
            migrationBuilder.Sql("DELETE FROM Roles");;
        }
    }
}
