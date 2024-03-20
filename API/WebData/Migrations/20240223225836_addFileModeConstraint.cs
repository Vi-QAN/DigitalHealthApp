using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace WebData.Migrations
{
    /// <inheritdoc />
    public partial class addFileModeConstraint : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_FileInformation_FileModes_FileModeId",
                table: "FileInformation");

            migrationBuilder.AddForeignKey(
                name: "FK_FileInformation_FileModes_FileModeId",
                table: "FileInformation",
                column: "FileModeId",
                principalTable: "FileModes",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_FileInformation_FileModes_FileModeId",
                table: "FileInformation");

            migrationBuilder.AddForeignKey(
                name: "FK_FileInformation_FileModes_FileModeId",
                table: "FileInformation",
                column: "FileModeId",
                principalTable: "FileModes",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
