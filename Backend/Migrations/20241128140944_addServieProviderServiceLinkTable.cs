using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace Backend.Migrations
{
    /// <inheritdoc />
    public partial class addServieProviderServiceLinkTable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "VendorServices",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    ServiceName = table.Column<string>(type: "text", nullable: false),
                    OrdersCount = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_VendorServices", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "ServiceProviderServiceLinks",
                columns: table => new
                {
                    ServiceVendorId = table.Column<int>(type: "integer", nullable: false),
                    VendorServiceId = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ServiceProviderServiceLinks", x => new { x.ServiceVendorId, x.VendorServiceId });
                    table.ForeignKey(
                        name: "FK_ServiceProviderServiceLinks_ServiceVendors_ServiceVendorId",
                        column: x => x.ServiceVendorId,
                        principalTable: "ServiceVendors",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ServiceProviderServiceLinks_VendorServices_VendorServiceId",
                        column: x => x.VendorServiceId,
                        principalTable: "VendorServices",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_ServiceProviderServiceLinks_VendorServiceId",
                table: "ServiceProviderServiceLinks",
                column: "VendorServiceId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ServiceProviderServiceLinks");

            migrationBuilder.DropTable(
                name: "VendorServices");
        }
    }
}
