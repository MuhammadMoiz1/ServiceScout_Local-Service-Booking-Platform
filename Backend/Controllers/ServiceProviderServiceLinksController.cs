using Microsoft.AspNetCore.Mvc;
using Backend.Data;
using Microsoft.EntityFrameworkCore;

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

        // GET: api/ServiceProviderServiceLinks/{serviceProviderId}
        [HttpGet("{serviceProviderId}")]
        public async Task<ActionResult<IEnumerable<ServiceProviderServiceLink>>> GetServiceProviderLinksForVendor(int serviceProviderId)
        {
            var links = await _context.ServiceProviderServiceLinks
                                       .Include(link => link.ServiceVendor)
                                       .Include(link => link.VendorService)
                                       .Where(link => link.ServiceVendorId == serviceProviderId)
                                       .ToListAsync();

            if (links == null || !links.Any())
            {
                return NotFound();
            }

            return Ok(links);
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
    }
}
