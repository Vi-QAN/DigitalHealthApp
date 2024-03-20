using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace WebData.Migrations
{
    /// <inheritdoc />
    public partial class AddAttachmentConfiguration : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_FileNoteAttachments_FileNotes_NoteId",
                table: "FileNoteAttachments");

            migrationBuilder.DropPrimaryKey(
                name: "PK_FileNoteAttachments",
                table: "FileNoteAttachments");

            migrationBuilder.RenameTable(
                name: "FileNoteAttachments",
                newName: "Attachments");

            migrationBuilder.RenameIndex(
                name: "IX_FileNoteAttachments_NoteId",
                table: "Attachments",
                newName: "IX_Attachments_NoteId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Attachments",
                table: "Attachments",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Attachments_FileNotes_NoteId",
                table: "Attachments",
                column: "NoteId",
                principalTable: "FileNotes",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Attachments_FileNotes_NoteId",
                table: "Attachments");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Attachments",
                table: "Attachments");

            migrationBuilder.RenameTable(
                name: "Attachments",
                newName: "FileNoteAttachments");

            migrationBuilder.RenameIndex(
                name: "IX_Attachments_NoteId",
                table: "FileNoteAttachments",
                newName: "IX_FileNoteAttachments_NoteId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_FileNoteAttachments",
                table: "FileNoteAttachments",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_FileNoteAttachments_FileNotes_NoteId",
                table: "FileNoteAttachments",
                column: "NoteId",
                principalTable: "FileNotes",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
