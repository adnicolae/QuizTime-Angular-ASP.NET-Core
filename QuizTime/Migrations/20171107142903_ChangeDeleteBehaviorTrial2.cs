using Microsoft.EntityFrameworkCore.Migrations;
using System;
using System.Collections.Generic;

namespace QuizTime.Migrations
{
    public partial class ChangeDeleteBehaviorTrial2 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Choices_Quizzes_QuizId",
                table: "Choices");

            migrationBuilder.AddForeignKey(
                name: "FK_Choices_Quizzes_QuizId",
                table: "Choices",
                column: "QuizId",
                principalTable: "Quizzes",
                principalColumn: "QuizId",
                onDelete: ReferentialAction.SetNull);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Choices_Quizzes_QuizId",
                table: "Choices");

            migrationBuilder.AddForeignKey(
                name: "FK_Choices_Quizzes_QuizId",
                table: "Choices",
                column: "QuizId",
                principalTable: "Quizzes",
                principalColumn: "QuizId",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
