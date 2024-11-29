using Microsoft.AspNetCore.Mvc;
using ServiceScout_Backend.Data;
using Microsoft.EntityFrameworkCore;

namespace ServiceScout_Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class VendorServicesController : ControllerBase
    {
        private readonly AppDbContext _context;

        // Constructor to initialize the context
        public VendorServicesController(AppDbContext context)
        {
            _context = context;
        }

        // Get all VendorServices
        [HttpGet]
        public async Task<ActionResult<IEnumerable<VendorService>>> GetVendorServices()
        {
            return await _context.VendorServices.ToListAsync();
        }

        // Get a specific VendorService by id ("/api/VendorServices/2")
        [HttpGet("{id}")]
        public async Task<ActionResult<VendorService>> GetVendorService(int id)
        {
            var vendorService = await _context.VendorServices.FindAsync(id);
            if (vendorService == null)
            {
                return NotFound();
            }
            return vendorService;
        }

        // POST: api/VendorServices
        [HttpPost]
        public async Task<ActionResult<VendorService>> PostVendorService(VendorService vendorService)
        {
            // If ServiceProviderServiceLinks is null, initialize it as an empty list
            if (vendorService.ServiceProviderServiceLinks == null)
            {
                vendorService.ServiceProviderServiceLinks = new List<ServiceProviderServiceLink>();
            }
            _context.VendorServices.Add(vendorService);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetVendorService), new { id = vendorService.Id }, vendorService);
        }

        // PUT: api/VendorServices/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutVendorService(int id, VendorService vendorService)
        {
            if (id != vendorService.Id)
            {
                return BadRequest();
            }

            _context.Entry(vendorService).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!VendorServiceExists(id)) 
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

        // DELETE: api/VendorServices/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteVendorService(int id)
        {
            var vendorService = await _context.VendorServices.FindAsync(id);
            if (vendorService == null)
            {
                return NotFound();
            }

            _context.VendorServices.Remove(vendorService);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool VendorServiceExists(int id)
        {
            return _context.VendorServices.Any(e => e.Id == id);
        }
    }
}
