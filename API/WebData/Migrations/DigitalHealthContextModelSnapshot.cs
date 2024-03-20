﻿// <auto-generated />
using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using WebData;

#nullable disable

namespace WebData.Migrations
{
    [DbContext(typeof(DigitalHealthContext))]
    partial class DigitalHealthContextModelSnapshot : ModelSnapshot
    {
        protected override void BuildModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "7.0.14")
                .HasAnnotation("Relational:MaxIdentifierLength", 128);

            SqlServerModelBuilderExtensions.UseIdentityColumns(modelBuilder);

            modelBuilder.Entity("WebData.Models.ActionLog", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Id"));

                    b.Property<DateTime>("AddedDate")
                        .HasColumnType("datetime2");

                    b.Property<int>("FileActionId")
                        .HasColumnType("int");

                    b.Property<int>("InformationId")
                        .HasColumnType("int");

                    b.Property<int>("UserId")
                        .HasColumnType("int");

                    b.HasKey("Id");

                    b.HasIndex("FileActionId");

                    b.HasIndex("InformationId");

                    b.HasIndex("UserId");

                    b.ToTable("ActionLogs", (string)null);
                });

            modelBuilder.Entity("WebData.Models.AuthorizationRecord", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Id"));

                    b.Property<int>("AccessorId")
                        .HasColumnType("int");

                    b.Property<DateTime>("AuthorizedDate")
                        .HasColumnType("datetime2");

                    b.Property<bool>("IsAuthorized")
                        .HasColumnType("bit");

                    b.Property<int>("OwnerId")
                        .HasColumnType("int");

                    b.HasKey("Id");

                    b.HasIndex("AccessorId");

                    b.HasIndex("OwnerId");

                    b.ToTable("AuthorizationRecords");
                });

            modelBuilder.Entity("WebData.Models.AvailableAction", b =>
                {
                    b.Property<int>("FileModeId")
                        .HasColumnType("int");

                    b.Property<int>("FileActionId")
                        .HasColumnType("int");

                    b.HasKey("FileModeId", "FileActionId");

                    b.HasIndex("FileActionId");

                    b.ToTable("AvailableActions", (string)null);
                });

            modelBuilder.Entity("WebData.Models.FileAction", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Id"));

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.HasKey("Id");

                    b.ToTable("FileActions", (string)null);
                });

            modelBuilder.Entity("WebData.Models.FileAuthorizationRecord", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Id"));

                    b.Property<int>("AccessorId")
                        .HasColumnType("int");

                    b.Property<DateTime>("AuthorizedDate")
                        .HasColumnType("datetime2");

                    b.Property<int>("FileInformationId")
                        .HasColumnType("int");

                    b.Property<bool>("IsAuthorized")
                        .HasColumnType("bit");

                    b.Property<int>("OwnerId")
                        .HasColumnType("int");

                    b.HasKey("Id");

                    b.HasIndex("AccessorId");

                    b.HasIndex("FileInformationId");

                    b.HasIndex("OwnerId");

                    b.ToTable("FileAuthorizationRecords");
                });

            modelBuilder.Entity("WebData.Models.FileInformation", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Id"));

                    b.Property<DateTime>("AddedDate")
                        .HasColumnType("datetime2");

                    b.Property<string>("FileExtension")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("FileHash")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<int>("FileModeId")
                        .HasColumnType("int");

                    b.Property<string>("FileName")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("FileType")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("MultiAddress")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<int>("OwnerId")
                        .HasColumnType("int");

                    b.HasKey("Id");

                    b.HasIndex("FileModeId");

                    b.HasIndex("OwnerId");

                    b.ToTable("FileInformation", (string)null);
                });

            modelBuilder.Entity("WebData.Models.FileMode", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Id"));

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.HasKey("Id");

                    b.ToTable("FileModes", (string)null);
                });

            modelBuilder.Entity("WebData.Models.FileNote", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Id"));

                    b.Property<DateTime>("AddedDate")
                        .HasColumnType("datetime2");

                    b.Property<string>("Content")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<int>("FileInformationId")
                        .HasColumnType("int");

                    b.Property<int>("UserId")
                        .HasColumnType("int");

                    b.HasKey("Id");

                    b.HasIndex("FileInformationId");

                    b.HasIndex("UserId");

                    b.ToTable("File Notes", (string)null);
                });

            modelBuilder.Entity("WebData.Models.FileNoteAttachment", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Id"));

                    b.Property<string>("FileName")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("FileType")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("Hash")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("IPFSHash")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<int>("NoteId")
                        .HasColumnType("int");

                    b.HasKey("Id");

                    b.HasIndex("NoteId");

                    b.ToTable("Attachments", (string)null);
                });

            modelBuilder.Entity("WebData.Models.Notification", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Id"));

                    b.Property<DateTime>("CreatedDate")
                        .HasColumnType("datetime2");

                    b.Property<bool>("IsRead")
                        .HasColumnType("bit");

                    b.Property<int>("LogId")
                        .HasColumnType("int");

                    b.Property<int>("RecipientId")
                        .HasColumnType("int");

                    b.HasKey("Id");

                    b.HasIndex("LogId");

                    b.HasIndex("RecipientId");

                    b.ToTable("Notifications", (string)null);
                });

            modelBuilder.Entity("WebData.Models.User", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Id"));

                    b.Property<string>("HomeAddress")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("Name")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("Phone")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("PublicKey")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.HasKey("Id");

                    b.ToTable("Users", (string)null);
                });

            modelBuilder.Entity("WebData.Models.ActionLog", b =>
                {
                    b.HasOne("WebData.Models.FileAction", "FileAction")
                        .WithMany("ActionLogs")
                        .HasForeignKey("FileActionId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("WebData.Models.FileInformation", "FileInformation")
                        .WithMany("ActionLogs")
                        .HasForeignKey("InformationId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("WebData.Models.User", "User")
                        .WithMany("ActionLogs")
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.NoAction)
                        .IsRequired();

                    b.Navigation("FileAction");

                    b.Navigation("FileInformation");

                    b.Navigation("User");
                });

            modelBuilder.Entity("WebData.Models.AuthorizationRecord", b =>
                {
                    b.HasOne("WebData.Models.User", null)
                        .WithMany()
                        .HasForeignKey("AccessorId")
                        .OnDelete(DeleteBehavior.NoAction)
                        .IsRequired();

                    b.HasOne("WebData.Models.User", null)
                        .WithMany()
                        .HasForeignKey("OwnerId")
                        .OnDelete(DeleteBehavior.NoAction)
                        .IsRequired();
                });

            modelBuilder.Entity("WebData.Models.AvailableAction", b =>
                {
                    b.HasOne("WebData.Models.FileAction", "FileAction")
                        .WithMany("AvailableActions")
                        .HasForeignKey("FileActionId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("WebData.Models.FileMode", "FileMode")
                        .WithMany("AvailableActions")
                        .HasForeignKey("FileModeId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("FileAction");

                    b.Navigation("FileMode");
                });

            modelBuilder.Entity("WebData.Models.FileAuthorizationRecord", b =>
                {
                    b.HasOne("WebData.Models.User", null)
                        .WithMany()
                        .HasForeignKey("AccessorId")
                        .OnDelete(DeleteBehavior.NoAction)
                        .IsRequired();

                    b.HasOne("WebData.Models.FileInformation", "FileInformation")
                        .WithMany("FileAuthorizationRecords")
                        .HasForeignKey("FileInformationId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("WebData.Models.User", null)
                        .WithMany()
                        .HasForeignKey("OwnerId")
                        .OnDelete(DeleteBehavior.NoAction)
                        .IsRequired();

                    b.Navigation("FileInformation");
                });

            modelBuilder.Entity("WebData.Models.FileInformation", b =>
                {
                    b.HasOne("WebData.Models.FileMode", "FileMode")
                        .WithMany("FileInformationList")
                        .HasForeignKey("FileModeId")
                        .OnDelete(DeleteBehavior.NoAction)
                        .IsRequired();

                    b.HasOne("WebData.Models.User", "Owner")
                        .WithMany("FileInformation")
                        .HasForeignKey("OwnerId")
                        .OnDelete(DeleteBehavior.NoAction)
                        .IsRequired();

                    b.Navigation("FileMode");

                    b.Navigation("Owner");
                });

            modelBuilder.Entity("WebData.Models.FileNote", b =>
                {
                    b.HasOne("WebData.Models.FileInformation", "FileInformation")
                        .WithMany("FileNotes")
                        .HasForeignKey("FileInformationId")
                        .OnDelete(DeleteBehavior.NoAction)
                        .IsRequired();

                    b.HasOne("WebData.Models.User", "User")
                        .WithMany("FileNotes")
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.NoAction)
                        .IsRequired();

                    b.Navigation("FileInformation");

                    b.Navigation("User");
                });

            modelBuilder.Entity("WebData.Models.FileNoteAttachment", b =>
                {
                    b.HasOne("WebData.Models.FileNote", "Note")
                        .WithMany("Attachments")
                        .HasForeignKey("NoteId")
                        .OnDelete(DeleteBehavior.NoAction)
                        .IsRequired();

                    b.Navigation("Note");
                });

            modelBuilder.Entity("WebData.Models.Notification", b =>
                {
                    b.HasOne("WebData.Models.ActionLog", "ActionLog")
                        .WithMany("Notifications")
                        .HasForeignKey("LogId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("WebData.Models.User", "Recipient")
                        .WithMany("Notifications")
                        .HasForeignKey("RecipientId")
                        .OnDelete(DeleteBehavior.NoAction)
                        .IsRequired();

                    b.Navigation("ActionLog");

                    b.Navigation("Recipient");
                });

            modelBuilder.Entity("WebData.Models.ActionLog", b =>
                {
                    b.Navigation("Notifications");
                });

            modelBuilder.Entity("WebData.Models.FileAction", b =>
                {
                    b.Navigation("ActionLogs");

                    b.Navigation("AvailableActions");
                });

            modelBuilder.Entity("WebData.Models.FileInformation", b =>
                {
                    b.Navigation("ActionLogs");

                    b.Navigation("FileAuthorizationRecords");

                    b.Navigation("FileNotes");
                });

            modelBuilder.Entity("WebData.Models.FileMode", b =>
                {
                    b.Navigation("AvailableActions");

                    b.Navigation("FileInformationList");
                });

            modelBuilder.Entity("WebData.Models.FileNote", b =>
                {
                    b.Navigation("Attachments");
                });

            modelBuilder.Entity("WebData.Models.User", b =>
                {
                    b.Navigation("ActionLogs");

                    b.Navigation("FileInformation");

                    b.Navigation("FileNotes");

                    b.Navigation("Notifications");
                });
#pragma warning restore 612, 618
        }
    }
}
