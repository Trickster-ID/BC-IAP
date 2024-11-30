using Microsoft.EntityFrameworkCore.Migrations;

namespace Project_IAP.Migrations
{
    public partial class initialcreate : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<bool>(
                name: "Status",
                table: "TB_T_UserInterview",
                nullable: true,
                oldClrType: typeof(bool));
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<bool>(
                name: "Status",
                table: "TB_T_UserInterview",
                nullable: false,
                oldClrType: typeof(bool),
                oldNullable: true);
        }
    }
}
