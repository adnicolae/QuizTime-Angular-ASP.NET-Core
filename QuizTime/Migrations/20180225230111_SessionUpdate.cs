using Microsoft.EntityFrameworkCore.Migrations;
using System;
using System.Collections.Generic;

namespace QuizTime.Migrations
{
    public partial class SessionUpdate : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<long>(
                name: "SelectedToExplainUserId",
                table: "Sessions",
                type: "bigint",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Sessions_SelectedToExplainUserId",
                table: "Sessions",
                column: "SelectedToExplainUserId");

            migrationBuilder.AddForeignKey(
                name: "FK_Sessions_Users_SelectedToExplainUserId",
                table: "Sessions",
                column: "SelectedToExplainUserId",
                principalTable: "Users",
                principalColumn: "UserId",
                onDelete: ReferentialAction.Restrict);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Sessions_Users_SelectedToExplainUserId",
                table: "Sessions");

            migrationBuilder.DropIndex(
                name: "IX_Sessions_SelectedToExplainUserId",
                table: "Sessions");

            migrationBuilder.DropColumn(
                name: "SelectedToExplainUserId",
                table: "Sessions");
        }
    }
}
