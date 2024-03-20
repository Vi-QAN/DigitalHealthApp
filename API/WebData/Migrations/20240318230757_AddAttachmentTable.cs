using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace WebData.Migrations
{
    /// <inheritdoc />
    public partial class AddAttachmentTable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_FileAuthorizationRecords_FileInformation_InformationId",
                table: "FileAuthorizationRecords");

            migrationBuilder.RenameColumn(
                name: "InformationId",
                table: "FileAuthorizationRecords",
                newName: "FileInformationId");

            migrationBuilder.RenameIndex(
                name: "IX_FileAuthorizationRecords_InformationId",
                table: "FileAuthorizationRecords",
                newName: "IX_FileAuthorizationRecords_FileInformationId");

            migrationBuilder.AddColumn<DateTime>(
                name: "AuthorizedDate",
                table: "FileAuthorizationRecords",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<DateTime>(
                name: "AuthorizedDate",
                table: "AuthorizationRecords",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.CreateTable(
                name: "FileNoteAttachments",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Hash = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    FileName = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    FileType = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    NoteId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_FileNoteAttachments", x => x.Id);
                    table.ForeignKey(
                        name: "FK_FileNoteAttachments_FileNotes_NoteId",
                        column: x => x.NoteId,
                        principalTable: "FileNotes",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_FileNoteAttachments_NoteId",
                table: "FileNoteAttachments",
                column: "NoteId");

            migrationBuilder.AddForeignKey(
                name: "FK_FileAuthorizationRecords_FileInformation_FileInformationId",
                table: "FileAuthorizationRecords",
                column: "FileInformationId",
                principalTable: "FileInformation",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_FileAuthorizationRecords_FileInformation_FileInformationId",
                table: "FileAuthorizationRecords");

            migrationBuilder.DropTable(
                name: "FileNoteAttachments");

            migrationBuilder.DropColumn(
                name: "AuthorizedDate",
                table: "FileAuthorizationRecords");

            migrationBuilder.DropColumn(
                name: "AuthorizedDate",
                table: "AuthorizationRecords");

            migrationBuilder.RenameColumn(
                name: "FileInformationId",
                table: "FileAuthorizationRecords",
                newName: "InformationId");

            migrationBuilder.RenameIndex(
                name: "IX_FileAuthorizationRecords_FileInformationId",
                table: "FileAuthorizationRecords",
                newName: "IX_FileAuthorizationRecords_InformationId");

            migrationBuilder.AddForeignKey(
                name: "FK_FileAuthorizationRecords_FileInformation_InformationId",
                table: "FileAuthorizationRecords",
                column: "InformationId",
                principalTable: "FileInformation",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
