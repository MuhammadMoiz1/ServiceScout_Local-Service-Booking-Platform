using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ServiceScout_Backend.Data;

namespace ServiceScout_Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ServiceRequestsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public ServiceRequestsController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/ServiceRequests
        [HttpGet]
        public async Task<ActionResult<IEnumerable<ServiceRequest>>> GetServiceRequests()
        {
            var serviceRequests = await _context.ServiceRequests
                                                .Include(r => r.User)  // Include user details
                                                .Include(r => r.Service)  // Include vendor service details
                                                .ToListAsync();
            return Ok(serviceRequests);
        }

        // GET: api/ServiceRequests/5
        [HttpGet("{id}")]
        public async Task<ActionResult<ServiceRequest>> GetServiceRequest(int id)
        {
            var serviceRequest = await _context.ServiceRequests
                                                .Include(r => r.User)
                                                .Include(r => r.Service)
                                                .FirstOrDefaultAsync(r => r.Id == id);

            if (serviceRequest == null)
            {
                return NotFound();
            }

            return Ok(serviceRequest);
        }

        // POST: api/ServiceRequests
        [HttpPost]
        public async Task<ActionResult<ServiceRequest>> PostServiceRequest(CreateServiceRequestDto requestDto)
        {
            // Validate if ServiceId and UserId are valid
            var service = await _context.VendorServices.FindAsync(requestDto.ServiceId);
            var user = await _context.Users.FindAsync(requestDto.UserId);

            if (service == null)
            {
                return BadRequest("Invalid ServiceId.");
            }

            if (user == null)
            {
                return BadRequest("Invalid UserId.");
            }

            // Create a new ServiceRequest from the DTO
            var serviceRequest = new ServiceRequest
            {
                UserId = requestDto.UserId,
                ServiceId = requestDto.ServiceId,
                Description = requestDto.Description,
                Area = requestDto.Area,
                Price = requestDto.Price,
                RequestedTime = requestDto.RequestedTime
            };

            // Add the new ServiceRequest to the database
            _context.ServiceRequests.Add(serviceRequest);
            await _context.SaveChangesAsync();

            // Return the newly created ServiceRequest with a CreatedAtAction response
            return CreatedAtAction(nameof(GetServiceRequest), new { id = serviceRequest.Id }, serviceRequest);
        }

        // PUT: api/ServiceRequests/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutServiceRequest(int id, UpdateServiceRequestDto requestDto)
        {
            if (id != requestDto.Id)
            {
                return BadRequest();
            }

            // Validate if ServiceId and UserId are valid
            var service = await _context.VendorServices.FindAsync(requestDto.ServiceId);
            var user = await _context.Users.FindAsync(requestDto.UserId);

            if (service == null)
            {
                return BadRequest("Invalid ServiceId.");
            }

            if (user == null)
            {
                return BadRequest("Invalid UserId.");
            }

            var serviceRequest = await _context.ServiceRequests.FindAsync(id);
            if (serviceRequest == null)
            {
                return NotFound();
            }

            // Update the ServiceRequest properties from the DTO
            serviceRequest.UserId = requestDto.UserId;
            serviceRequest.ServiceId = requestDto.ServiceId;
            serviceRequest.Description = requestDto.Description;
            serviceRequest.Area = requestDto.Area;
            serviceRequest.Price = requestDto.Price;
            serviceRequest.RequestedTime = requestDto.RequestedTime;

            _context.Entry(serviceRequest).State = EntityState.Modified;
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // DELETE: api/ServiceRequests/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteServiceRequest(int id)
        {
            var serviceRequest = await _context.ServiceRequests.FindAsync(id);
            if (serviceRequest == null)
            {
                return NotFound();
            }

            _context.ServiceRequests.Remove(serviceRequest);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool ServiceRequestExists(int id)
        {
            return _context.ServiceRequests.Any(e => e.Id == id);
        }
    }

    // DTO for creating a new ServiceRequest
    public class CreateServiceRequestDto
    {
        public int UserId { get; set; }
        public int ServiceId { get; set; }
        public string Description { get; set; }
        public string Area { get; set; }
        public float Price { get; set; }
        public DateTime RequestedTime { get; set; }
    }

    // DTO for updating an existing ServiceRequest
    public class UpdateServiceRequestDto : CreateServiceRequestDto
    {
        public int Id { get; set; }
    }
}
