using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ESOF.WebApp.DBLayer.Migrations
{
    /// <inheritdoc />
    public partial class schemagametok : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Comment_Users_UserId",
                table: "Comment");

            migrationBuilder.DropForeignKey(
                name: "FK_Comment_Video_VideoId",
                table: "Comment");

            migrationBuilder.DropForeignKey(
                name: "FK_Like_Users_UserId",
                table: "Like");

            migrationBuilder.DropForeignKey(
                name: "FK_Like_Video_VideoId",
                table: "Like");

            migrationBuilder.DropForeignKey(
                name: "FK_Video_Users_UserId",
                table: "Video");

            migrationBuilder.DropForeignKey(
                name: "FK_Video_VideoQuests_ChallengeId",
                table: "Video");

            migrationBuilder.DropForeignKey(
                name: "FK_VideoQuests_Game_GameId",
                table: "VideoQuests");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Video",
                table: "Video");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Like",
                table: "Like");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Game",
                table: "Game");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Comment",
                table: "Comment");

            migrationBuilder.EnsureSchema(
                name: "gametok");

            migrationBuilder.RenameTable(
                name: "VideoQuests",
                newName: "VideoQuests",
                newSchema: "gametok");

            migrationBuilder.RenameTable(
                name: "Video",
                newName: "Videos",
                newSchema: "gametok");

            migrationBuilder.RenameTable(
                name: "Like",
                newName: "Likes",
                newSchema: "gametok");

            migrationBuilder.RenameTable(
                name: "Game",
                newName: "Games",
                newSchema: "gametok");

            migrationBuilder.RenameTable(
                name: "Comment",
                newName: "Comments",
                newSchema: "gametok");

            migrationBuilder.RenameColumn(
                name: "caption",
                schema: "gametok",
                table: "Videos",
                newName: "Caption");

            migrationBuilder.RenameIndex(
                name: "IX_Video_UserId",
                schema: "gametok",
                table: "Videos",
                newName: "IX_Videos_UserId");

            migrationBuilder.RenameIndex(
                name: "IX_Video_ChallengeId",
                schema: "gametok",
                table: "Videos",
                newName: "IX_Videos_ChallengeId");

            migrationBuilder.RenameIndex(
                name: "IX_Like_VideoId",
                schema: "gametok",
                table: "Likes",
                newName: "IX_Likes_VideoId");

            migrationBuilder.RenameIndex(
                name: "IX_Comment_VideoId",
                schema: "gametok",
                table: "Comments",
                newName: "IX_Comments_VideoId");

            migrationBuilder.AddColumn<int>(
                name: "ViewCount",
                schema: "gametok",
                table: "Videos",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddPrimaryKey(
                name: "PK_Videos",
                schema: "gametok",
                table: "Videos",
                column: "VideoId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Likes",
                schema: "gametok",
                table: "Likes",
                columns: new[] { "UserId", "VideoId" });

            migrationBuilder.AddPrimaryKey(
                name: "PK_Games",
                schema: "gametok",
                table: "Games",
                column: "GameId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Comments",
                schema: "gametok",
                table: "Comments",
                columns: new[] { "UserId", "VideoId" });

            migrationBuilder.AddForeignKey(
                name: "FK_Comments_Users_UserId",
                schema: "gametok",
                table: "Comments",
                column: "UserId",
                principalTable: "Users",
                principalColumn: "UserId",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Comments_Videos_VideoId",
                schema: "gametok",
                table: "Comments",
                column: "VideoId",
                principalSchema: "gametok",
                principalTable: "Videos",
                principalColumn: "VideoId",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Likes_Users_UserId",
                schema: "gametok",
                table: "Likes",
                column: "UserId",
                principalTable: "Users",
                principalColumn: "UserId",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Likes_Videos_VideoId",
                schema: "gametok",
                table: "Likes",
                column: "VideoId",
                principalSchema: "gametok",
                principalTable: "Videos",
                principalColumn: "VideoId",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_VideoQuests_Games_GameId",
                schema: "gametok",
                table: "VideoQuests",
                column: "GameId",
                principalSchema: "gametok",
                principalTable: "Games",
                principalColumn: "GameId",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Videos_Users_UserId",
                schema: "gametok",
                table: "Videos",
                column: "UserId",
                principalTable: "Users",
                principalColumn: "UserId",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Videos_VideoQuests_ChallengeId",
                schema: "gametok",
                table: "Videos",
                column: "ChallengeId",
                principalSchema: "gametok",
                principalTable: "VideoQuests",
                principalColumn: "VideoQuestId",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Comments_Users_UserId",
                schema: "gametok",
                table: "Comments");

            migrationBuilder.DropForeignKey(
                name: "FK_Comments_Videos_VideoId",
                schema: "gametok",
                table: "Comments");

            migrationBuilder.DropForeignKey(
                name: "FK_Likes_Users_UserId",
                schema: "gametok",
                table: "Likes");

            migrationBuilder.DropForeignKey(
                name: "FK_Likes_Videos_VideoId",
                schema: "gametok",
                table: "Likes");

            migrationBuilder.DropForeignKey(
                name: "FK_VideoQuests_Games_GameId",
                schema: "gametok",
                table: "VideoQuests");

            migrationBuilder.DropForeignKey(
                name: "FK_Videos_Users_UserId",
                schema: "gametok",
                table: "Videos");

            migrationBuilder.DropForeignKey(
                name: "FK_Videos_VideoQuests_ChallengeId",
                schema: "gametok",
                table: "Videos");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Videos",
                schema: "gametok",
                table: "Videos");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Likes",
                schema: "gametok",
                table: "Likes");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Games",
                schema: "gametok",
                table: "Games");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Comments",
                schema: "gametok",
                table: "Comments");

            migrationBuilder.DropColumn(
                name: "ViewCount",
                schema: "gametok",
                table: "Videos");

            migrationBuilder.RenameTable(
                name: "VideoQuests",
                schema: "gametok",
                newName: "VideoQuests");

            migrationBuilder.RenameTable(
                name: "Videos",
                schema: "gametok",
                newName: "Video");

            migrationBuilder.RenameTable(
                name: "Likes",
                schema: "gametok",
                newName: "Like");

            migrationBuilder.RenameTable(
                name: "Games",
                schema: "gametok",
                newName: "Game");

            migrationBuilder.RenameTable(
                name: "Comments",
                schema: "gametok",
                newName: "Comment");

            migrationBuilder.RenameColumn(
                name: "Caption",
                table: "Video",
                newName: "caption");

            migrationBuilder.RenameIndex(
                name: "IX_Videos_UserId",
                table: "Video",
                newName: "IX_Video_UserId");

            migrationBuilder.RenameIndex(
                name: "IX_Videos_ChallengeId",
                table: "Video",
                newName: "IX_Video_ChallengeId");

            migrationBuilder.RenameIndex(
                name: "IX_Likes_VideoId",
                table: "Like",
                newName: "IX_Like_VideoId");

            migrationBuilder.RenameIndex(
                name: "IX_Comments_VideoId",
                table: "Comment",
                newName: "IX_Comment_VideoId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Video",
                table: "Video",
                column: "VideoId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Like",
                table: "Like",
                columns: new[] { "UserId", "VideoId" });

            migrationBuilder.AddPrimaryKey(
                name: "PK_Game",
                table: "Game",
                column: "GameId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Comment",
                table: "Comment",
                columns: new[] { "UserId", "VideoId" });

            migrationBuilder.AddForeignKey(
                name: "FK_Comment_Users_UserId",
                table: "Comment",
                column: "UserId",
                principalTable: "Users",
                principalColumn: "UserId",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Comment_Video_VideoId",
                table: "Comment",
                column: "VideoId",
                principalTable: "Video",
                principalColumn: "VideoId",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Like_Users_UserId",
                table: "Like",
                column: "UserId",
                principalTable: "Users",
                principalColumn: "UserId",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Like_Video_VideoId",
                table: "Like",
                column: "VideoId",
                principalTable: "Video",
                principalColumn: "VideoId",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Video_Users_UserId",
                table: "Video",
                column: "UserId",
                principalTable: "Users",
                principalColumn: "UserId",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Video_VideoQuests_ChallengeId",
                table: "Video",
                column: "ChallengeId",
                principalTable: "VideoQuests",
                principalColumn: "VideoQuestId",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_VideoQuests_Game_GameId",
                table: "VideoQuests",
                column: "GameId",
                principalTable: "Game",
                principalColumn: "GameId",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
