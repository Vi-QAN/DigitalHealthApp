using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace WebData.Migrations
{
    /// <inheritdoc />
    public partial class ApplyFilesSummaryConfiguration : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_FilesSummaries_Users_OwnerId",
                table: "FilesSummaries");

            migrationBuilder.DropPrimaryKey(
                name: "PK_FilesSummaries",
                table: "FilesSummaries");

            migrationBuilder.RenameTable(
                name: "FilesSummaries",
                newName: "FilesSummary");

            migrationBuilder.RenameIndex(
                name: "IX_FilesSummaries_OwnerId",
                table: "FilesSummary",
                newName: "IX_FilesSummary_OwnerId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_FilesSummary",
                table: "FilesSummary",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_FilesSummary_Users_OwnerId",
                table: "FilesSummary",
                column: "OwnerId",
                principalTable: "Users",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_FilesSummary_Users_OwnerId",
                table: "FilesSummary");

            migrationBuilder.DropPrimaryKey(
                name: "PK_FilesSummary",
                table: "FilesSummary");

            migrationBuilder.RenameTable(
                name: "FilesSummary",
                newName: "FilesSummaries");

            migrationBuilder.RenameIndex(
                name: "IX_FilesSummary_OwnerId",
                table: "FilesSummaries",
                newName: "IX_FilesSummaries_OwnerId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_FilesSummaries",
                table: "FilesSummaries",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_FilesSummaries_Users_OwnerId",
                table: "FilesSummaries",
                column: "OwnerId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
