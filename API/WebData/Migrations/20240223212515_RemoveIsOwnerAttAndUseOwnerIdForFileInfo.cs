using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace WebData.Migrations
{
    /// <inheritdoc />
    public partial class RemoveIsOwnerAttAndUseOwnerIdForFileInfo : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_FileInformation_Users_UserId",
                table: "FileInformation");

            migrationBuilder.DropColumn(
                name: "IsOwner",
                table: "ActionLogs");

            migrationBuilder.RenameColumn(
                name: "UserId",
                table: "FileInformation",
                newName: "OwnerId");

            migrationBuilder.RenameIndex(
                name: "IX_FileInformation_UserId",
                table: "FileInformation",
                newName: "IX_FileInformation_OwnerId");

            migrationBuilder.AddColumn<int>(
                name: "FileModeId",
                table: "FileInformation",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "IX_FileInformation_FileModeId",
                table: "FileInformation",
                column: "FileModeId");

            migrationBuilder.AddForeignKey(
                name: "FK_FileInformation_FileModes_FileModeId",
                table: "FileInformation",
                column: "FileModeId",
                principalTable: "FileModes",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_FileInformation_Users_OwnerId",
                table: "FileInformation",
                column: "OwnerId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_FileInformation_FileModes_FileModeId",
                table: "FileInformation");

            migrationBuilder.DropForeignKey(
                name: "FK_FileInformation_Users_OwnerId",
                table: "FileInformation");

            migrationBuilder.DropIndex(
                name: "IX_FileInformation_FileModeId",
                table: "FileInformation");

            migrationBuilder.DropColumn(
                name: "FileModeId",
                table: "FileInformation");

            migrationBuilder.RenameColumn(
                name: "OwnerId",
                table: "FileInformation",
                newName: "UserId");

            migrationBuilder.RenameIndex(
                name: "IX_FileInformation_OwnerId",
                table: "FileInformation",
                newName: "IX_FileInformation_UserId");

            migrationBuilder.AddColumn<bool>(
                name: "IsOwner",
                table: "ActionLogs",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddForeignKey(
                name: "FK_FileInformation_Users_UserId",
                table: "FileInformation",
                column: "UserId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
