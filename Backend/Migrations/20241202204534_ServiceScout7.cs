using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Backend.Migrations
{
    /// <inheritdoc />
    public partial class ServiceScout7 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "SavedServices",
                columns: table => new
                {
                    ServiceVendorId = table.Column<int>(type: "integer", nullable: false),
                    ServiceRequestId = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SavedServices", x => new { x.ServiceVendorId, x.ServiceRequestId });
                    table.ForeignKey(
                        name: "FK_SavedServices_ServiceRequests_ServiceRequestId",
                        column: x => x.ServiceRequestId,
                        principalTable: "ServiceRequests",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_SavedServices_ServiceVendors_ServiceVendorId",
                        column: x => x.ServiceVendorId,
                        principalTable: "ServiceVendors",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_SavedServices_ServiceRequestId",
                table: "SavedServices",
                column: "ServiceRequestId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "SavedServices");
        }
    }
}
