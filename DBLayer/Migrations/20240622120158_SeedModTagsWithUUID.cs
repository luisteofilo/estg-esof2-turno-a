using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace ESOF.WebApp.DBLayer.Migrations
{
    /// <inheritdoc />
    public partial class SeedModTagsWithUUID : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.InsertData(
                table: "ModTags",
                columns: new[] { "TagId", "Description", "Name" },
                values: new object[,]
                {
                    { new Guid("05e4447e-a308-4f18-b261-0b4954c7fade"), "Mods that expand the game world or add new areas to explore.", "Exploration" },
                    { new Guid("292bd67c-0b4e-45e8-8200-b52e24044c0a"), "Mods that enhance or change the game’s sound effects, music, and voice acting.", "Audio" },
                    { new Guid("37abb62e-8e5d-44e5-92b7-acfe6e028190"), "Mods that improve the overall user experience with small but impactful changes.", "Quality of Life" },
                    { new Guid("5571e5c7-d231-4ee0-a947-2e3af1d48824"), "Mods that add new quests, missions, or enhance exploration.", "Adventure" },
                    { new Guid("5ff92d4f-73d0-4032-b532-0ee15cc348be"), "Mods that expand or enhance the crafting system in the game.", "Crafting" },
                    { new Guid("85cf9dcf-bb00-4d2c-883a-191e4373cef2"), "Mods that increase the overall immersive experience of the game.", "Immersion" },
                    { new Guid("922c3cf9-92d2-4c27-b30e-6e50a9e6e4af"), "Mods that add survival elements or make the game more challenging.", "Survival" },
                    { new Guid("b351d947-2813-4c63-8dc8-be18c2d1a745"), "Mods that introduce new characters or alter existing ones.", "Characters" },
                    { new Guid("c2ce67c5-7ee5-4fd3-94aa-af248775e309"), "Mods that introduce new storylines, missions, or quests.", "Story" },
                    { new Guid("d20641e5-6587-4b77-980f-1f33f4bed835"), "Mods that add new weapons, armor, or equipment.", "Weapons and Armor" },
                    { new Guid("e571ab56-7ab9-4277-be93-79ccedf2b821"), "Mods that enhance graphics, textures, or overall visual appeal.", "Graphics" },
                    { new Guid("eb930f5a-49bc-4ce6-b0a2-f74e32002b89"), "Mods that add or enhance multiplayer capabilities.", "Multiplayer" }
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "ModTags",
                keyColumn: "TagId",
                keyValue: new Guid("05e4447e-a308-4f18-b261-0b4954c7fade"));

            migrationBuilder.DeleteData(
                table: "ModTags",
                keyColumn: "TagId",
                keyValue: new Guid("292bd67c-0b4e-45e8-8200-b52e24044c0a"));

            migrationBuilder.DeleteData(
                table: "ModTags",
                keyColumn: "TagId",
                keyValue: new Guid("37abb62e-8e5d-44e5-92b7-acfe6e028190"));

            migrationBuilder.DeleteData(
                table: "ModTags",
                keyColumn: "TagId",
                keyValue: new Guid("5571e5c7-d231-4ee0-a947-2e3af1d48824"));

            migrationBuilder.DeleteData(
                table: "ModTags",
                keyColumn: "TagId",
                keyValue: new Guid("5ff92d4f-73d0-4032-b532-0ee15cc348be"));

            migrationBuilder.DeleteData(
                table: "ModTags",
                keyColumn: "TagId",
                keyValue: new Guid("85cf9dcf-bb00-4d2c-883a-191e4373cef2"));

            migrationBuilder.DeleteData(
                table: "ModTags",
                keyColumn: "TagId",
                keyValue: new Guid("922c3cf9-92d2-4c27-b30e-6e50a9e6e4af"));

            migrationBuilder.DeleteData(
                table: "ModTags",
                keyColumn: "TagId",
                keyValue: new Guid("b351d947-2813-4c63-8dc8-be18c2d1a745"));

            migrationBuilder.DeleteData(
                table: "ModTags",
                keyColumn: "TagId",
                keyValue: new Guid("c2ce67c5-7ee5-4fd3-94aa-af248775e309"));

            migrationBuilder.DeleteData(
                table: "ModTags",
                keyColumn: "TagId",
                keyValue: new Guid("d20641e5-6587-4b77-980f-1f33f4bed835"));

            migrationBuilder.DeleteData(
                table: "ModTags",
                keyColumn: "TagId",
                keyValue: new Guid("e571ab56-7ab9-4277-be93-79ccedf2b821"));

            migrationBuilder.DeleteData(
                table: "ModTags",
                keyColumn: "TagId",
                keyValue: new Guid("eb930f5a-49bc-4ce6-b0a2-f74e32002b89"));
        }
    }
}
