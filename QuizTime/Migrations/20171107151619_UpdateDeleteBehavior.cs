using Microsoft.EntityFrameworkCore.Migrations;
using System;
using System.Collections.Generic;

namespace QuizTime.Migrations
{
    public partial class UpdateDeleteBehavior : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Sessions_Quizzes_QuizId",
                table: "Sessions");

            migrationBuilder.AddForeignKey(
                name: "FK_Sessions_Quizzes_QuizId",
                table: "Sessions",
                column: "QuizId",
                principalTable: "Quizzes",
                principalColumn: "QuizId",
                onDelete: ReferentialAction.Cascade);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Sessions_Quizzes_QuizId",
                table: "Sessions");

            migrationBuilder.AddForeignKey(
                name: "FK_Sessions_Quizzes_QuizId",
                table: "Sessions",
                column: "QuizId",
                principalTable: "Quizzes",
                principalColumn: "QuizId",
                onDelete: ReferentialAction.SetNull);
        }
    }
}
