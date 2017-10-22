using Microsoft.EntityFrameworkCore.Migrations;
using System;
using System.Collections.Generic;

namespace QuizTime.Migrations
{
    public partial class FirstModelUpdate : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<long>(
                name: "ChoiceId",
                table: "Results",
                type: "bigint",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Results_ChoiceId",
                table: "Results",
                column: "ChoiceId");

            migrationBuilder.AddForeignKey(
                name: "FK_Results_Choices_ChoiceId",
                table: "Results",
                column: "ChoiceId",
                principalTable: "Choices",
                principalColumn: "ChoiceId",
                onDelete: ReferentialAction.Restrict);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Results_Choices_ChoiceId",
                table: "Results");

            migrationBuilder.DropIndex(
                name: "IX_Results_ChoiceId",
                table: "Results");

            migrationBuilder.DropColumn(
                name: "ChoiceId",
                table: "Results");
        }
    }
}
