using Microsoft.EntityFrameworkCore;
using Npgsql.EntityFrameworkCore.PostgreSQL;
using System.Text.Json.Serialization;


namespace Backend.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<User> Users { get; set; }
        public DbSet<ServiceVendor> ServiceVendors { get; set; }
        public DbSet<VendorService> VendorServices { get; set; }
        public DbSet<ServiceProviderServiceLink> ServiceProviderServiceLinks { get; set; }
        public DbSet<ServiceRequest> ServiceRequests { get; set; }
        public DbSet<PendingLog> PendingLogs { get; set; }
        public DbSet<ServiceOrder> ServiceOrders { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<ServiceProviderServiceLink>()
                .HasKey(link => new { link.ServiceVendorId, link.VendorServiceId }); // Composite key
        }
    }

    public class User
    {
        public int Id { get; set; } // Primary Key
        public required string Name { get; set; }
        public required string Area { get; set; }
        public required string CnicNumber { get; set; }
        public required decimal Rating { get; set; }
        public required int TotalOrders { get; set; }
        public required string Email { get; set; }
        public required string PasswordHash { get; set; }
        public required string ContactInfo { get; set; }
    }

    public class VendorService
    {
        public int Id { get; set; }
        public required string ServiceName { get; set; }
        public required int OrdersCount { get; set; }

        // Make the navigation property nullable
        [JsonIgnore]
        public ICollection<ServiceProviderServiceLink>? ServiceProviderServiceLinks { get; set; } // Nullable
    }

    public class ServiceVendor
    {
        public int Id { get; set; } // Primary Key
        public required string Name { get; set; }
        public required string Area { get; set; }
        public required string CnicNumber { get; set; }
        public required decimal Rating { get; set; }
        public required decimal TotalRevenue { get; set; }
        public required int TotalOrders { get; set; }
        public required string Email { get; set; }
        public required string PasswordHash { get; set; }
        public required string ContactInfo { get; set; }

        // Make the navigation property nullable
        [JsonIgnore]
        public ICollection<ServiceProviderServiceLink>? ServiceProviderServiceLinks { get; set; } // Nullable
    }

    public class ServiceProviderServiceLink
    {
        public int ServiceVendorId { get; set; }  // Foreign key for ServiceVendor
        [JsonIgnore]
        public ServiceVendor ServiceVendor { get; set; }  // Navigation property

        public int VendorServiceId { get; set; }  // Foreign key for VendorService
        [JsonIgnore]
        public VendorService VendorService { get; set; }  // Navigation property
    }

    public class ServiceRequest
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        [JsonIgnore]
        public User User { get; set; }
        public string Description { get; set; }
        public string Area { get; set; }
        public float Price { get; set; }
        public bool Iscompleted { get; set; }
        public DateTime RequestedTime { get; set; }
        public DateTime PostedOn { get; set; }
        public int ServiceId { get; set; }
        [JsonIgnore]
        public VendorService Service { get; set; }
    }

    public class PendingLog
    {
        public int Id { get; set; }
        public int RequestId { get; set; }
        public int UserId { get; set; }
        public int VendorId { get; set; }
        public float Amount { get; set; }
        public bool Requester {  get; set; }

        [JsonIgnore]
        public ServiceRequest Request { get; set; }
        [JsonIgnore]
        public User User { get; set; }
        [JsonIgnore]
        public ServiceVendor Vendor { get; set; }

    }

    public class ServiceOrder
    {
        public int Id { get; set; }
        public int RequestId { get; set; }
        public int VendorId { get; set; }
        public string Status { get; set; }

        [JsonIgnore]
        public ServiceRequest Request { get; set; }
        [JsonIgnore]
        public ServiceVendor Vendor { get; set; }
    }
}
