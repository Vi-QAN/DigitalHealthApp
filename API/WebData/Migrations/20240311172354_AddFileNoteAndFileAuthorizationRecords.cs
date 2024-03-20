using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace WebData.Migrations
{
    /// <inheritdoc />
    public partial class AddFileNoteAndFileAuthorizationRecords : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_FileInformation_Users_OwnerId",
                table: "FileInformation");

            migrationBuilder.DropPrimaryKey(
                name: "PK_AuthorizationRecords",
                table: "AuthorizationRecords");

            migrationBuilder.AddColumn<int>(
                name: "Id",
                table: "AuthorizationRecords",
                type: "int",
                nullable: false,
                defaultValue: 0)
                .Annotation("SqlServer:Identity", "1, 1");

            migrationBuilder.AddPrimaryKey(
                name: "PK_AuthorizationRecords",
                table: "AuthorizationRecords",
                column: "Id");

            migrationBuilder.CreateTable(
                name: "FileAuthorizationRecords",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    OwnerId = table.Column<int>(type: "int", nullable: false),
                    AccessorId = table.Column<int>(type: "int", nullable: false),
                    IsAuthorized = table.Column<bool>(type: "bit", nullable: false),
                    InformationId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_FileAuthorizationRecords", x => x.Id);
                    table.ForeignKey(
                        name: "FK_FileAuthorizationRecords_FileInformation_InformationId",
                        column: x => x.InformationId,
                        principalTable: "FileInformation",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_FileAuthorizationRecords_Users_AccessorId",
                        column: x => x.AccessorId,
                        principalTable: "Users",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_FileAuthorizationRecords_Users_OwnerId",
                        column: x => x.OwnerId,
                        principalTable: "Users",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "FileNotes",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Content = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    AddedDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UserId = table.Column<int>(type: "int", nullable: false),
                    FileInformationId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_FileNotes", x => x.Id);
                    table.ForeignKey(
                        name: "FK_FileNotes_FileInformation_FileInformationId",
                        column: x => x.FileInformationId,
                        principalTable: "FileInformation",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_FileNotes_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_AuthorizationRecords_AccessorId",
                table: "AuthorizationRecords",
                column: "AccessorId");

            migrationBuilder.CreateIndex(
                name: "IX_FileAuthorizationRecords_AccessorId",
                table: "FileAuthorizationRecords",
                column: "AccessorId");

            migrationBuilder.CreateIndex(
                name: "IX_FileAuthorizationRecords_InformationId",
                table: "FileAuthorizationRecords",
                column: "InformationId");

            migrationBuilder.CreateIndex(
                name: "IX_FileAuthorizationRecords_OwnerId",
                table: "FileAuthorizationRecords",
                column: "OwnerId");

            migrationBuilder.CreateIndex(
                name: "IX_FileNotes_FileInformationId",
                table: "FileNotes",
                column: "FileInformationId");

            migrationBuilder.CreateIndex(
                name: "IX_FileNotes_UserId",
                table: "FileNotes",
                column: "UserId");

            migrationBuilder.AddForeignKey(
                name: "FK_FileInformation_Users_OwnerId",
                table: "FileInformation",
                column: "OwnerId",
                principalTable: "Users",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_FileInformation_Users_OwnerId",
                table: "FileInformation");

            migrationBuilder.DropTable(
                name: "FileAuthorizationRecords");

            migrationBuilder.DropTable(
                name: "FileNotes");

            migrationBuilder.DropPrimaryKey(
                name: "PK_AuthorizationRecords",
                table: "AuthorizationRecords");

            migrationBuilder.DropIndex(
                name: "IX_AuthorizationRecords_AccessorId",
                table: "AuthorizationRecords");

            migrationBuilder.DropColumn(
                name: "Id",
                table: "AuthorizationRecords");

            migrationBuilder.AddPrimaryKey(
                name: "PK_AuthorizationRecords",
                table: "AuthorizationRecords",
                columns: new[] { "AccessorId", "OwnerId" });

            migrationBuilder.AddForeignKey(
                name: "FK_FileInformation_Users_OwnerId",
                table: "FileInformation",
                column: "OwnerId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
