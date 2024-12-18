using Microsoft.AspNetCore.Mvc;
using Backend.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;
using Backend.Authentication;
using System.Security.Claims;

namespace Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ServiceVendorsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public ServiceVendorsController(AppDbContext context)
        {
            _context = context;
        }

        // Get ServiceVendors
        [HttpGet]
        [Authorize(Roles = "User")]
        public async Task<ActionResult<IEnumerable<ServiceVendor>>> GetServiceVendors()
        {
            return await _context.ServiceVendors.
                OrderByDescending(v => v.Rating).
                ThenByDescending(v => v.TotalOrders).
                ToListAsync();
        }
        // DTO for ServiceVendor
        public class ServiceVendorDto
        {
            public int Id { get; set; }
            public string Name { get; set; }
            public string Area { get; set; }
            public decimal Rating { get; set; }
            public int TotalOrders { get; set; }
        }

        [HttpGet("user-vendors")]
        [Authorize(Roles = "User")]
        public async Task<ActionResult<IEnumerable<ServiceVendorDto>>> GetVendorsForUser()
        {
            var currentUserId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier));

            var vendorsForUser = await _context.ServiceOrders
                .Include(so => so.Vendor)
                .Where(so => so.Request.UserId == currentUserId)
                .GroupBy(g => g.Vendor.Id)
                .Select(g => new ServiceVendorDto
                {
                    //Id = g.Vendor.Id,
                    //Name = g.Vendor.Name,
                    //Area = g.Vendor.Area,
                    //Rating = g.Vendor.Rating,
                    //TotalOrders = g.Vendor.TotalOrders,
                    Id = g.Key, // Vendor.Id from the group
                    Name = g.First().Vendor.Name, // Name from the first record in the group
                    Area = g.First().Vendor.Area, // Area from the first record in the group
                    Rating = g.First().Vendor.Rating, // Rating from the first record in the group
                    TotalOrders = g.First().Vendor.TotalOrders,
                })
                .OrderByDescending(v => v.Rating)
                .ThenByDescending(v => v.TotalOrders)
                .ToListAsync();

            return Ok(vendorsForUser);
        }
        [HttpGet("trending-vendors")]
        [Authorize(Roles = "User")]
        public async Task<ActionResult<IEnumerable<ServiceVendorDto>>> GetTrendingVendorsForUser()
        {
            var currentUserId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier));
            var loc = await _context.Users.FindAsync(currentUserId);

            var vendorsForUser = await _context.ServiceVendors
                .Where(so => so.Area == loc.Area)
                .Select(g => new ServiceVendorDto
                {
                    Id = g.Id,
                    Name = g.Name,
                    Area = g.Area,
                    Rating = g.Rating,
                    TotalOrders = g.TotalOrders,
                })
                .OrderByDescending(g => g.Rating)
                .ThenByDescending(v => v.TotalOrders)
                .ToListAsync();

            return Ok(vendorsForUser);
        }
        [HttpGet("responsers/{id}")]
        [Authorize(Roles = "User")]
        public async Task<ActionResult<IEnumerable<ServiceVendor>>> ResponserId(int id)
        {
            var serviceRequests = await _context.PendingLogs
                                       .Include(r => r.Request)
                                       .Where(r => r.Request.Id == id)
                                       .Select(r => new ResponserIdDto
                                       {
                                           Id = r.VendorId,
                                       })
                                       .ToListAsync();

            return Ok(serviceRequests);
        }

        // Get a serviceVendor "/api/ServiceVendors/2"
        [HttpGet("{id}")]
        public async Task<ActionResult<ServiceVendor>> GetServiceVendor(int id)
        {
            var serviceVendor = await _context.ServiceVendors.FindAsync(id);
            if (serviceVendor == null)
            {
                return NotFound();
            }
            return serviceVendor;
        }

        // POST: api/ServiceVendors
        [HttpPost]
        public async Task<ActionResult<ServiceVendor>> PostServiceVendor(ServiceVendor serviceVendor)
        {
            _context.ServiceVendors.Add(serviceVendor);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetServiceVendor), new { id = serviceVendor.Id }, serviceVendor);
        }

        // PUT: api/ServiceVendors/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutServiceVendor(int id, ServiceVendor serviceVendor)
        {
            if (id != serviceVendor.Id)
            {
                return BadRequest();
            }

            _context.Entry(serviceVendor).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ServiceVendorExists(id))  // Corrected here
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // DELETE: api/ServiceVendors/3
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteServiceVendor(int id)
        {
            var serviceVendor = await _context.ServiceVendors.FindAsync(id);
            if (serviceVendor == null)
            {
                return NotFound();
            }

            _context.ServiceVendors.Remove(serviceVendor);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool ServiceVendorExists(int id)
        {
            return _context.ServiceVendors.Any(e => e.Id == id);
        }
    }
    public class ResponserIdDto
    {
        public int Id { get; set; }
    }
}
