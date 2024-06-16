using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Application.Migrations
{
    /// <inheritdoc />
    public partial class NewMigration1 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Notification_Sensor_SensorId",
                table: "Notification");

            migrationBuilder.RenameColumn(
                name: "SensorId",
                table: "Notification",
                newName: "SensorReadingId");

            migrationBuilder.RenameIndex(
                name: "IX_Notification_SensorId",
                table: "Notification",
                newName: "IX_Notification_SensorReadingId");

            migrationBuilder.AddForeignKey(
                name: "FK_Notification_SensorReading_SensorReadingId",
                table: "Notification",
                column: "SensorReadingId",
                principalTable: "SensorReading",
                principalColumn: "SensorReadingId",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Notification_SensorReading_SensorReadingId",
                table: "Notification");

            migrationBuilder.RenameColumn(
                name: "SensorReadingId",
                table: "Notification",
                newName: "SensorId");

            migrationBuilder.RenameIndex(
                name: "IX_Notification_SensorReadingId",
                table: "Notification",
                newName: "IX_Notification_SensorId");

            migrationBuilder.AddForeignKey(
                name: "FK_Notification_Sensor_SensorId",
                table: "Notification",
                column: "SensorId",
                principalTable: "Sensor",
                principalColumn: "SensorId",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
