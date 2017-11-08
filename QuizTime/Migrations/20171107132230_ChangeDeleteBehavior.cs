using Microsoft.EntityFrameworkCore.Migrations;
using System;
using System.Collections.Generic;

namespace QuizTime.Migrations
{
    public partial class ChangeDeleteBehavior : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Choices_Quizzes_QuizId",
                table: "Choices");

            migrationBuilder.DropForeignKey(
                name: "FK_Quizzes_Users_CreatorUserId",
                table: "Quizzes");

            migrationBuilder.AddForeignKey(
                name: "FK_Choices_Quizzes_QuizId",
                table: "Choices",
                column: "QuizId",
                principalTable: "Quizzes",
                principalColumn: "QuizId",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Quizzes_Users_CreatorUserId",
                table: "Quizzes",
                column: "CreatorUserId",
                principalTable: "Users",
                principalColumn: "UserId",
                onDelete: ReferentialAction.SetNull);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Choices_Quizzes_QuizId",
                table: "Choices");

            migrationBuilder.DropForeignKey(
                name: "FK_Quizzes_Users_CreatorUserId",
                table: "Quizzes");

            migrationBuilder.AddForeignKey(
                name: "FK_Choices_Quizzes_QuizId",
                table: "Choices",
                column: "QuizId",
                principalTable: "Quizzes",
                principalColumn: "QuizId",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Quizzes_Users_CreatorUserId",
                table: "Quizzes",
                column: "CreatorUserId",
                principalTable: "Users",
                principalColumn: "UserId",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
