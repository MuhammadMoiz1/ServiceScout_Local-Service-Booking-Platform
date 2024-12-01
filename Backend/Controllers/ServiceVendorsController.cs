using Microsoft.AspNetCore.Mvc;
using Backend.Data;
using Microsoft.EntityFrameworkCore;

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
        public async Task<ActionResult<IEnumerable<ServiceVendor>>> GetServiceVendors()
        {
            return await _context.ServiceVendors.ToListAsync();
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
}
