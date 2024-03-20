using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace WebData.Migrations
{
    /// <inheritdoc />
    public partial class ApplyFileNoteConfig : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Attachments_FileNotes_NoteId",
                table: "Attachments");

            migrationBuilder.DropForeignKey(
                name: "FK_FileNotes_FileInformation_FileInformationId",
                table: "FileNotes");

            migrationBuilder.DropForeignKey(
                name: "FK_FileNotes_Users_UserId",
                table: "FileNotes");

            migrationBuilder.DropPrimaryKey(
                name: "PK_FileNotes",
                table: "FileNotes");

            migrationBuilder.RenameTable(
                name: "FileNotes",
                newName: "File Notes");

            migrationBuilder.RenameIndex(
                name: "IX_FileNotes_UserId",
                table: "File Notes",
                newName: "IX_File Notes_UserId");

            migrationBuilder.RenameIndex(
                name: "IX_FileNotes_FileInformationId",
                table: "File Notes",
                newName: "IX_File Notes_FileInformationId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_File Notes",
                table: "File Notes",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Attachments_File Notes_NoteId",
                table: "Attachments",
                column: "NoteId",
                principalTable: "File Notes",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_File Notes_FileInformation_FileInformationId",
                table: "File Notes",
                column: "FileInformationId",
                principalTable: "FileInformation",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_File Notes_Users_UserId",
                table: "File Notes",
                column: "UserId",
                principalTable: "Users",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Attachments_File Notes_NoteId",
                table: "Attachments");

            migrationBuilder.DropForeignKey(
                name: "FK_File Notes_FileInformation_FileInformationId",
                table: "File Notes");

            migrationBuilder.DropForeignKey(
                name: "FK_File Notes_Users_UserId",
                table: "File Notes");

            migrationBuilder.DropPrimaryKey(
                name: "PK_File Notes",
                table: "File Notes");

            migrationBuilder.RenameTable(
                name: "File Notes",
                newName: "FileNotes");

            migrationBuilder.RenameIndex(
                name: "IX_File Notes_UserId",
                table: "FileNotes",
                newName: "IX_FileNotes_UserId");

            migrationBuilder.RenameIndex(
                name: "IX_File Notes_FileInformationId",
                table: "FileNotes",
                newName: "IX_FileNotes_FileInformationId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_FileNotes",
                table: "FileNotes",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Attachments_FileNotes_NoteId",
                table: "Attachments",
                column: "NoteId",
                principalTable: "FileNotes",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_FileNotes_FileInformation_FileInformationId",
                table: "FileNotes",
                column: "FileInformationId",
                principalTable: "FileInformation",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_FileNotes_Users_UserId",
                table: "FileNotes",
                column: "UserId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
