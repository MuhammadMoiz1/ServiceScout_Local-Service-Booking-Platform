using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Backend.Data;
using Microsoft.AspNetCore.Authorization;
using Backend.Authentication;
using System.Security.Claims;

namespace Backend.Controllers
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

        // GET: api/PendingLogs/Vendor
        [HttpGet("Vendor")]
        [Authorize(Roles = "Vendor")]
        public async Task<ActionResult<IEnumerable<PendingLogDto>>> GetPendingLogsForVendor()
        {
            
            var currentVendorIdString = User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (string.IsNullOrEmpty(currentVendorIdString) || !int.TryParse(currentVendorIdString, out int currentVendorId))
            {
                return BadRequest(new { Message = "Invalid vendor.", VendorId = currentVendorIdString });
            }

          
            var pendingLogs = await _context.PendingLogs
                .Where(pl => pl.VendorId == currentVendorId)  
                .Include(pl => pl.Request)  
                .ThenInclude(r => r.User)  
                .Include(pl => pl.Request.Service)  
                .Select(pl => new PendingLogDto
                {
                    RequestId = pl.Request.Id,
                    Description = pl.Request.Description,
                    Area = pl.Request.Area,
                    Price = (decimal)pl.Request.Price,
                    IsCompleted = pl.Request.Iscompleted,
                    PostedOn = pl.Request.PostedOn,
                    Username = pl.Request.User.Name,
                    UserId = pl.Request.User.Id,
                    ServiceName = pl.Request.Service.ServiceName,
                    VendorId = pl.VendorId,
                    Amount = (decimal)pl.Amount 
                })
                .ToListAsync();

            return Ok(pendingLogs);
        }

        // GET: api/PendingLogs/Vendor-direct
        [HttpGet("Vendor-direct")]
        [Authorize(Roles = "Vendor")]
        public async Task<ActionResult<IEnumerable<PendingLogDto>>> GetDirectRequestsForVendor()
        {

            var currentVendorIdString = User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (string.IsNullOrEmpty(currentVendorIdString) || !int.TryParse(currentVendorIdString, out int currentVendorId))
            {
                return BadRequest(new { Message = "Invalid vendor.", VendorId = currentVendorIdString });
            }


            var pendingLogs = await _context.PendingLogs
                .Where(pl => pl.VendorId == currentVendorId && pl.Requester== true)
                .Include(pl => pl.Request)
                .ThenInclude(r => r.User)
                .Include(pl => pl.Request.Service)
                .Select(pl => new PendingLogDto
                {
                    RequestId = pl.Request.Id,
                    Description = pl.Request.Description,
                    Area = pl.Request.Area,
                    Price = (decimal)pl.Request.Price,
                    IsCompleted = pl.Request.Iscompleted,
                    PostedOn = pl.Request.PostedOn,
                    Username = pl.Request.User.Name,
                    UserId = pl.Request.User.Id,
                    ServiceName = pl.Request.Service.ServiceName,
                    VendorId = pl.VendorId,
                    Amount = (decimal)pl.Amount
                })
                .ToListAsync();

            return Ok(pendingLogs);
        }



        // POST: api/PendingLogs
        [HttpPost]
        public async Task<ActionResult<PendingLog>> PostPendingLog(CreatePendingLogDto pendingLogDto)
        {

            var vendorId =  User.FindFirstValue(ClaimTypes.NameIdentifier); 

            if (string.IsNullOrEmpty(vendorId))
            {
                return Unauthorized("Vendor not logged in.");
            }

            var providerId = int.Parse(vendorId);

            // Validate if RequestId, UserId, and VendorId are valid
            var serviceRequest = await _context.ServiceRequests.FindAsync(pendingLogDto.RequestId);
            var user = await _context.Users.FindAsync(pendingLogDto.UserId);
            var vendor = await _context.ServiceVendors.FindAsync(providerId);

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
                VendorId = providerId,
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

        // DELETE: api/PendingLogs/Request/{requestId}/Vendor/{vendorId}
        [HttpDelete("Request/{requestId}/Vendor/{vendorId}")]
        public async Task<IActionResult> DeleteAccepted(int requestId, int vendorId)
        {
            var pendingLog = await _context.PendingLogs
                .FirstOrDefaultAsync(pl => pl.RequestId == requestId && pl.VendorId == vendorId);

            if (pendingLog == null)
            {
                return NotFound(new { Message = "Pending log not found." });
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
    public class PendingLogDto
    {
        public int RequestId { get; set; }
        public string Description { get; set; }
        public string Area { get; set; }
        public decimal Price { get; set; }
        public bool IsCompleted { get; set; }
        public DateTime PostedOn { get; set; }
        public string Username { get; set; }
        public int UserId { get; set; }
        public string ServiceName { get; set; }
        public int VendorId { get; set; }
        public decimal Amount { get; set; } 
    }
    // DTO for updating an existing PendingLog
    public class UpdatePendingLogDto : CreatePendingLogDto
    {
        public int Id { get; set; }
    }
}
