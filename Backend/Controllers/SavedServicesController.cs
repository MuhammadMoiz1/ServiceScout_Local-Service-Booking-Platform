using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using Backend.Data;
using System.Security.Claims;

namespace Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SavedServicesController : ControllerBase
    {
        private readonly AppDbContext _context;

        public SavedServicesController(AppDbContext context)
        {
            _context = context;
        }

        // DTO for creating a saved service
        public class CreateSavedServiceDto
        {
            public int ServiceRequestId { get; set; }
        }

        // POST: api/SavedServices
        [HttpPost]
        [Authorize(Roles = "Vendor")]
        public async Task<ActionResult<SavedService>> SaveService(CreateSavedServiceDto savedServiceDto)
        {
            // Get the current logged-in vendor's ID
            var currentVendorId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier));

            // Validate if ServiceRequest exists
            var serviceRequest = await _context.ServiceRequests.FindAsync(savedServiceDto.ServiceRequestId);
            if (serviceRequest == null)
            {
                return BadRequest("Invalid ServiceRequestId.");
            }

            // Check if the service is already saved
            var existingSavedService = await _context.SavedServices
                .FirstOrDefaultAsync(ss =>
                    ss.ServiceVendorId == currentVendorId &&
                    ss.ServiceRequestId == savedServiceDto.ServiceRequestId);

            if (existingSavedService != null)
            {
                return Conflict("This service is already saved.");
            }

            // Create a new SavedService
            var savedService = new SavedService
            {
                ServiceVendorId = currentVendorId,
                ServiceRequestId = savedServiceDto.ServiceRequestId
            };

            // Add the new SavedService to the database
            _context.SavedServices.Add(savedService);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetSavedService), new { id = savedService.ServiceRequestId }, savedService);
        }

        // GET: api/SavedServices
        [HttpGet]
        [Authorize(Roles = "Vendor")]
        public async Task<ActionResult<IEnumerable<SavedServiceDto>>> GetSavedServices()
        {
            var currentVendorId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier));

            var savedServices = await _context.SavedServices
                .Where(ss => ss.ServiceVendorId == currentVendorId)
                .Include(ss => ss.ServiceRequest)
                    .ThenInclude(sr => sr.User)
                .Include(ss => ss.ServiceRequest)
                    .ThenInclude(sr => sr.Service)
                .Select(ss => new SavedServiceDto
                {
                    Id = ss.ServiceRequest.Id,
                    Description = ss.ServiceRequest.Description,
                    Area = ss.ServiceRequest.Area,
                    Price = ss.ServiceRequest.Price,
                    Username = ss.ServiceRequest.User.Name,
                    ServiceName = ss.ServiceRequest.Service.ServiceName,
                    PostedOn = ss.ServiceRequest.PostedOn
                })
                .ToListAsync();

            return Ok(savedServices);
        }

        // GET: api/SavedServices/5
        [HttpGet("{id}")]
        [Authorize(Roles = "Vendor")]
        public async Task<ActionResult<SavedService>> GetSavedService(int id)
        {
            var currentVendorId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier));

            var savedService = await _context.SavedServices
                .FirstOrDefaultAsync(ss =>
                    ss.ServiceVendorId == currentVendorId &&
                    ss.ServiceRequestId == id);

            if (savedService == null)
            {
                return NotFound();
            }

            return Ok(savedService);
        }

        // DELETE: api/SavedServices/5
        [HttpDelete("{id}")]
        [Authorize(Roles = "Vendor")]
        public async Task<IActionResult> DeleteSavedService(int id)
        {
            var currentVendorId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier));

            var savedService = await _context.SavedServices
                .FirstOrDefaultAsync(ss =>
                    ss.ServiceVendorId == currentVendorId &&
                    ss.ServiceRequestId == id);

            if (savedService == null)
            {
                return NotFound();
            }

            _context.SavedServices.Remove(savedService);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // DTO for returning saved service details
        public class SavedServiceDto
        {
            public int Id { get; set; }
            public string Description { get; set; }
            public string Area { get; set; }
            public float Price { get; set; }
            public string Username { get; set; }
            public string ServiceName { get; set; }
            public DateTime PostedOn { get; set; }
        }
    }
}