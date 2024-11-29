using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ServiceScout_Backend.Data;

namespace ServiceScout_Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PendingLogsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public PendingLogsController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/PendingLogs
        [HttpGet]
        public async Task<ActionResult<IEnumerable<PendingLog>>> GetPendingLogs()
        {
            var pendingLogs = await _context.PendingLogs
                .Include(pl => pl.Request)      // Include the ServiceRequest related to the PendingLog
                .Include(pl => pl.User)         // Include the User related to the PendingLog
                .Include(pl => pl.Vendor)       // Include the ServiceVendor related to the PendingLog
                .ToListAsync();

            return Ok(pendingLogs);
        }

        // GET: api/PendingLogs/5
        [HttpGet("{id}")]
        public async Task<ActionResult<PendingLog>> GetPendingLog(int id)
        {
            var pendingLog = await _context.PendingLogs
                .Include(pl => pl.Request)
                .Include(pl => pl.User)
                .Include(pl => pl.Vendor)
                .FirstOrDefaultAsync(pl => pl.Id == id);

            if (pendingLog == null)
            {
                return NotFound();
            }

            return Ok(pendingLog);
        }

        // POST: api/PendingLogs
        [HttpPost]
        public async Task<ActionResult<PendingLog>> PostPendingLog(CreatePendingLogDto pendingLogDto)
        {
            // Validate if RequestId, UserId, and VendorId are valid
            var serviceRequest = await _context.ServiceRequests.FindAsync(pendingLogDto.RequestId);
            var user = await _context.Users.FindAsync(pendingLogDto.UserId);
            var vendor = await _context.ServiceVendors.FindAsync(pendingLogDto.VendorId);

            if (serviceRequest == null)
            {
                return BadRequest("Invalid RequestId.");
            }

            if (user == null)
            {
                return BadRequest("Invalid UserId.");
            }

            if (vendor == null)
            {
                return BadRequest("Invalid VendorId.");
            }

            // Create a new PendingLog from the DTO
            var pendingLog = new PendingLog
            {
                RequestId = pendingLogDto.RequestId,
                UserId = pendingLogDto.UserId,
                VendorId = pendingLogDto.VendorId,
                Amount = pendingLogDto.Amount
            };

            // Add the new PendingLog to the database
            _context.PendingLogs.Add(pendingLog);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetPendingLog), new { id = pendingLog.Id }, pendingLog);
        }

        // PUT: api/PendingLogs/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutPendingLog(int id, UpdatePendingLogDto pendingLogDto)
        {
            if (id != pendingLogDto.Id)
            {
                return BadRequest();
            }

            // Validate if RequestId, UserId, and VendorId are valid
            var serviceRequest = await _context.ServiceRequests.FindAsync(pendingLogDto.RequestId);
            var user = await _context.Users.FindAsync(pendingLogDto.UserId);
            var vendor = await _context.ServiceVendors.FindAsync(pendingLogDto.VendorId);

            if (serviceRequest == null)
            {
                return BadRequest("Invalid RequestId.");
            }

            if (user == null)
            {
                return BadRequest("Invalid UserId.");
            }

            if (vendor == null)
            {
                return BadRequest("Invalid VendorId.");
            }

            var pendingLog = await _context.PendingLogs.FindAsync(id);
            if (pendingLog == null)
            {
                return NotFound();
            }

            // Update the PendingLog from the DTO
            pendingLog.RequestId = pendingLogDto.RequestId;
            pendingLog.UserId = pendingLogDto.UserId;
            pendingLog.VendorId = pendingLogDto.VendorId;
            pendingLog.Amount = pendingLogDto.Amount;

            _context.Entry(pendingLog).State = EntityState.Modified;
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // DELETE: api/PendingLogs/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletePendingLog(int id)
        {
            var pendingLog = await _context.PendingLogs.FindAsync(id);
            if (pendingLog == null)
            {
                return NotFound();
            }

            _context.PendingLogs.Remove(pendingLog);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool PendingLogExists(int id)
        {
            return _context.PendingLogs.Any(pl => pl.Id == id);
        }
    }

    // DTO for creating a new PendingLog
    public class CreatePendingLogDto
    {
        public int RequestId { get; set; }
        public int UserId { get; set; }
        public int VendorId { get; set; }
        public float Amount { get; set; }
    }

    // DTO for updating an existing PendingLog
    public class UpdatePendingLogDto : CreatePendingLogDto
    {
        public int Id { get; set; }
    }
}
