using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using Backend.Data;
using Backend.Authentication;
using System.Security.Claims;

namespace Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ServiceProviderServiceLinksController : ControllerBase
    {
        private readonly AppDbContext _context;

        public ServiceProviderServiceLinksController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/ServiceProviderServiceLinks
        [HttpGet]
        public async Task<ActionResult<IEnumerable<ServiceProviderServiceLink>>> GetServiceProviderServiceLinks()
        {
            var links = await _context.ServiceProviderServiceLinks
                                       .Include(link => link.ServiceVendor)  // Include related ServiceVendor data
                                       .Include(link => link.VendorService)  // Include related VendorService data
                                       .ToListAsync();
            return Ok(links);
        }

        // GET: api/ServiceProviderServiceLinks/{serviceProviderId}/{vendorServiceId}
        [HttpGet("{serviceProviderId}/{vendorServiceId}")]
        public async Task<ActionResult<ServiceProviderServiceLink>> GetServiceProviderServiceLink(int serviceProviderId, int vendorServiceId)
        {
            var link = await _context.ServiceProviderServiceLinks
                                      .Include(link => link.ServiceVendor)
                                      .Include(link => link.VendorService)
                                      .FirstOrDefaultAsync(x => x.ServiceVendorId == serviceProviderId && x.VendorServiceId == vendorServiceId);

            if (link == null)
            {
                return NotFound();
            }

            return Ok(link);
        }
        [HttpGet("{serviceProviderId}")]
        public async Task<ActionResult<IEnumerable<VendorServicesDto>>> GetServiceProviderServices(int serviceProviderId)
        {
            var links = await _context.ServiceProviderServiceLinks
                .Include(link => link.VendorService) // Include the related VendorService to access ServiceName
                .Where(x => x.ServiceVendorId == serviceProviderId)
                .Select(link => new VendorServicesDto
                {
                    ServiceName = link.VendorService.ServiceName // Select only ServiceName
                })
                .ToListAsync();

            if (!links.Any())
            {
                return NotFound("No services found for the given service provider.");
            }

            return Ok(links);
        }


        // GET: api/ServiceProviderServiceLinks
        [HttpGet("vendor")]
        public async Task<ActionResult<IEnumerable<VendorServiceDto>>> GetServiceProviderLinksForVendor()
        {
            var currentVendorId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier));

            var services = await _context.ServiceProviderServiceLinks
                .Where(link => link.ServiceVendorId == currentVendorId)
                .Select(link => new VendorServiceDto
                {
                    ServiceId = link.VendorService.Id,
                    ServiceName = link.VendorService.ServiceName
                })
                .ToListAsync();

            if (!services.Any())
            {
                return NoContent();
            }

            return Ok(services);
        }

        // POST: api/ServiceProviderServiceLinks
        [HttpPost]
        public async Task<ActionResult<ServiceProviderServiceLink>> PostServiceProviderServiceLink(ServiceProviderServiceLink link)
        {
            // Check if the ServiceProvider and VendorService already exist in the table
            var exists = await _context.ServiceProviderServiceLinks
                .AnyAsync(x => x.ServiceVendorId == link.ServiceVendorId && x.VendorServiceId == link.VendorServiceId);

            if (exists)
            {
                return BadRequest("The link between this ServiceProvider and VendorService already exists.");
            }

            _context.ServiceProviderServiceLinks.Add(link);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetServiceProviderServiceLink),
                new { serviceProviderId = link.ServiceVendorId, vendorServiceId = link.VendorServiceId }, link);
        }

        // DELETE: api/ServiceProviderServiceLinks/{serviceProviderId}/{vendorServiceId}
        [HttpDelete("{serviceProviderId}/{vendorServiceId}")]
        public async Task<IActionResult> DeleteServiceProviderServiceLink(int serviceProviderId, int vendorServiceId)
        {
            var link = await _context.ServiceProviderServiceLinks
                                      .FirstOrDefaultAsync(x => x.ServiceVendorId == serviceProviderId && x.VendorServiceId == vendorServiceId);

            if (link == null)
            {
                return NotFound();
            }

            _context.ServiceProviderServiceLinks.Remove(link);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        public class VendorServiceDto
        {
            public int ServiceId { get; set; }
            public string ServiceName { get; set; }
        }
    }
    public class VendorServicesDto
    {
        public string ServiceName { get; set; }
    }
}
