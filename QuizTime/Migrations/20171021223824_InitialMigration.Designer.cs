﻿// <auto-generated />
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Storage;
using Microsoft.EntityFrameworkCore.Storage.Internal;
using QuizTime.Data;
using System;

namespace QuizTime.Migrations
{
    [DbContext(typeof(Context))]
    [Migration("20171021223824_InitialMigration")]
    partial class InitialMigration
    {
        protected override void BuildTargetModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "2.0.0-rtm-26452")
                .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

            modelBuilder.Entity("QuizTime.Models.Choice", b =>
                {
                    b.Property<long>("ChoiceId")
                        .ValueGeneratedOnAdd();

                    b.Property<bool>("Correctness");

                    b.Property<long?>("QuizId");

                    b.Property<string>("Title");

                    b.HasKey("ChoiceId");

                    b.HasIndex("QuizId");

                    b.ToTable("Choices");
                });

            modelBuilder.Entity("QuizTime.Models.Quiz", b =>
                {
                    b.Property<long>("QuizId")
                        .ValueGeneratedOnAdd();

                    b.Property<int>("AssignedPoints");

                    b.Property<long?>("CreatorUserId");

                    b.Property<DateTime>("DateCreated");

                    b.Property<string>("Title");

                    b.HasKey("QuizId");

                    b.HasIndex("CreatorUserId");

                    b.ToTable("Quizzes");
                });

            modelBuilder.Entity("QuizTime.Models.Result", b =>
                {
                    b.Property<long>("ResultId")
                        .ValueGeneratedOnAdd();

                    b.Property<int>("Score");

                    b.Property<long?>("SessionId");

                    b.Property<long?>("SessionParticipantUserId");

                    b.HasKey("ResultId");

                    b.HasIndex("SessionId");

                    b.HasIndex("SessionParticipantUserId");

                    b.ToTable("Results");
                });

            modelBuilder.Entity("QuizTime.Models.Session", b =>
                {
                    b.Property<long>("SessionId")
                        .ValueGeneratedOnAdd();

                    b.Property<DateTime>("DateCreated");

                    b.Property<long?>("QuizId");

                    b.Property<int>("TimeLimit");

                    b.HasKey("SessionId");

                    b.HasIndex("QuizId");

                    b.ToTable("Sessions");
                });

            modelBuilder.Entity("QuizTime.Models.User", b =>
                {
                    b.Property<long>("UserId")
                        .ValueGeneratedOnAdd();

                    b.Property<string>("Password");

                    b.Property<string>("Username");

                    b.HasKey("UserId");

                    b.ToTable("Users");
                });

            modelBuilder.Entity("QuizTime.Models.Choice", b =>
                {
                    b.HasOne("QuizTime.Models.Quiz", "Quiz")
                        .WithMany("Choices")
                        .HasForeignKey("QuizId");
                });

            modelBuilder.Entity("QuizTime.Models.Quiz", b =>
                {
                    b.HasOne("QuizTime.Models.User", "Creator")
                        .WithMany("QuizzesCreated")
                        .HasForeignKey("CreatorUserId");
                });

            modelBuilder.Entity("QuizTime.Models.Result", b =>
                {
                    b.HasOne("QuizTime.Models.Session", "Session")
                        .WithMany("Results")
                        .HasForeignKey("SessionId");

                    b.HasOne("QuizTime.Models.User", "SessionParticipant")
                        .WithMany("Results")
                        .HasForeignKey("SessionParticipantUserId");
                });

            modelBuilder.Entity("QuizTime.Models.Session", b =>
                {
                    b.HasOne("QuizTime.Models.Quiz", "Quiz")
                        .WithMany()
                        .HasForeignKey("QuizId");
                });
#pragma warning restore 612, 618
        }
    }
}
