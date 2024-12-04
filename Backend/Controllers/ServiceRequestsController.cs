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
    public class ServiceRequestsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public ServiceRequestsController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/ServiceRequests
        [HttpGet]

        public async Task<ActionResult<IEnumerable<ServiceRequestDto>>> GetServiceRequests()
        {
            var serviceRequests = await _context.ServiceRequests
                .Include(r => r.User)  
                .Include(r => r.Service)  
                .Select(r => new ServiceRequestDto  
                {
                    Id = r.Id,
                    Description = r.Description,
                    Area = r.Area,
                    Price = r.Price,
                    IsCompleted = r.Iscompleted,
                    PostedOn = r.PostedOn,
                    Username = r.User.Name,  
                    UserId = r.User.Id,
                    ServiceName = r.Service.ServiceName  
                })
                .ToListAsync();

            return Ok(serviceRequests);
        }

        [HttpGet("pending")]
        public async Task<ActionResult<IEnumerable<ServiceRequestDto>>> GetPendingServiceRequests()
        {
            var serviceRequests = await _context.ServiceRequests
                .Where(r => r.Iscompleted == false)  
                .Include(r => r.User)
                .Include(r => r.Service)
                .Select(r => new ServiceRequestDto
                {
                    Id = r.Id,
                    Description = r.Description,
                    Area = r.Area,
                    Price = r.Price,
                    IsCompleted = r.Iscompleted,
                    PostedOn = r.PostedOn,
                    RequestedTime=r.RequestedTime,
                    Username = r.User.Name,
                    UserId = r.User.Id,
                    ServiceName = r.Service.ServiceName
                })
                .ToListAsync();

            return Ok(serviceRequests);
        }

       

        // GET: api/ServiceRequests/5
        [HttpGet("{id}")]
        [Authorize(Roles = "User")]
        public async Task<ActionResult<ServiceRequest>> GetServiceRequest(int id)
        {
            var serviceRequest = await _context.ServiceRequests
                                                .Include(r => r.User)
                                                .Include(r => r.Service)
                                                .FirstOrDefaultAsync(r => r.Id == id);
            var serviceRequestAmount = await _context.PendingLogs
                                       .Include(r => r.Request)
                                       .Where(r => r.Request.Id == id)
                                       .CountAsync();


            if (serviceRequest == null)
            {
                return NotFound();
            }

            return Ok(new { serviceRequest=serviceRequest,Amount = serviceRequestAmount});
        }

        // GET: api/ServiceRequests/nearby
        [HttpGet("nearby")]
        [Authorize(Roles = "Vendor")] 
        public async Task<ActionResult<IEnumerable<ServiceRequestDto>>> GetNearbyPendingServiceRequests()
        {
           

            var currentVendorId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier));

         
            var vendor = await _context.ServiceVendors
                                        .FirstOrDefaultAsync(v => v.Id == currentVendorId);

            if (vendor == null)
            {
                return NotFound("Vendor not found.");
            }

            var vendorArea = vendor.Area; 

          
            var pendingRequests = await _context.ServiceRequests
                                                .Where(r => r.Iscompleted == false && r.Area == vendorArea)
                                                .Include(r => r.User)
                                                .Include(r => r.Service)
                                                .Select(r => new ServiceRequestDto
                                                {
                                                    Id = r.Id,
                                                    Description = r.Description,
                                                    Area = r.Area,
                                                    Price = r.Price,
                                                    IsCompleted = r.Iscompleted,
                                                    PostedOn = r.PostedOn,
                                                    RequestedTime = r.RequestedTime,
                                                    Username = r.User.Name,
                                                    UserId = r.User.Id,
                                                    ServiceName = r.Service.ServiceName
                                                })
                                                .ToListAsync();

            if (!pendingRequests.Any())
            {
                return NoContent(); 
            }

            return Ok(pendingRequests);
        }


        //[HttpGet("Completed")]
        //[Authorize(Roles = "Vendor")]
        //public async Task<ActionResult<IEnumerable<ServiceRequestDto>>> GetVendorCompletedServiceRequests()
        //{
        //    var currentVendorId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier));

        //    var serviceRequests = await _context.ServiceRequests
        //        .Where(r => r.VendorId == currentVendorId && r.Iscompleted)
        //        .Include(r => r.User)
        //        .Include(r => r.Service)
        //        .Select(r => new ServiceRequestDto
        //        {
        //            Id = r.Id,
        //            Description = r.Description,
        //            Area = r.Area,
        //            Price = r.Price,
        //            IsCompleted = r.Iscompleted,
        //            PostedOn = r.PostedOn,
        //            Username = r.User.Name,
        //            UserId = r.User.Id,
        //            ServiceName = r.Service.ServiceName
        //        })
        //        .ToListAsync();

        //    return Ok(serviceRequests);
        //}


        [HttpGet("userCurrent")]
        [Authorize(Roles = "User")]
        public async Task<ActionResult<IEnumerable<ServiceRequestDto>>> GetUserCurrentServiceRequests()
        {
            var currentUserId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier));
            var serviceRequests = await _context.ServiceRequests
                .Where(r => r.Iscompleted == false && r.User.Id == currentUserId)
                .Include(r => r.User)
                .OrderByDescending(r => r.PostedOn)
                .Select(r => new ServiceIDRequestDto
                {
                    Id = r.Id,
                })
                .ToListAsync();
            
            return Ok(serviceRequests);
        }
        // POST: api/ServiceRequests

        [HttpPost]
        [Authorize(Roles = "User")]
        public async Task<ActionResult<ServiceRequest>> PostServiceRequest(CreateServiceRequestDto requestDto)
        {
            // Validate if ServiceId and UserId are valid
            var currentUserId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier));
            var service = await _context.VendorServices.FindAsync(requestDto.ServiceId);
            var user = await _context.Users.FindAsync(currentUserId);

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
                UserId = currentUserId,
                ServiceId = requestDto.ServiceId,
                Description = requestDto.Description,
                Area = requestDto.Area,
                Price = requestDto.Price,
                RequestedTime = DateTime.SpecifyKind(requestDto.RequestedTime, DateTimeKind.Utc),
                Iscompleted = false,
                PostedOn= DateTime.UtcNow
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

        // PUT: api/ServiceRequests/accept
        [HttpPut("accept")]
        public async Task<IActionResult> AcceptServiceRequest([FromBody] AcceptServiceRequestDto requestDto)
        {
           
            var serviceRequest = await _context.ServiceRequests.FindAsync(requestDto.Id);
            if (serviceRequest == null)
            {
                return NotFound(new { Message = "Service request not found." });
            }

         
            serviceRequest.Iscompleted = requestDto.IsCompleted;
            serviceRequest.Price= requestDto.Price;

            // Save the changes to the database
            _context.Entry(serviceRequest).State = EntityState.Modified;
            await _context.SaveChangesAsync();

            return NoContent(); 
        }

        [HttpGet("PendingRatings")]
        [Authorize(Roles = "User")]
        public async Task<ActionResult<IEnumerable<ServiceRequestDto>>> GetPendingRatings()
        {
            var currentUserId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier));
            var oneDayAgo = DateTime.UtcNow.AddDays(-1);

            var pendingRatings = await _context.ServiceRequests
                .Where(r => r.UserId == currentUserId &&
                            r.Iscompleted == true &&
                            r.RequestedTime <= oneDayAgo &&
                            !_context.ServiceOrders.Any(so => so.RequestId == r.Id && so.Status == "Rated"))
                .Select(r => new ServiceRequestDto
                {
                    Id = r.Id,
                    Description = r.Description,
                    Area = r.Area,
                    Price = r.Price,
                    PostedOn = r.PostedOn,
                    RequestedTime = r.RequestedTime,
                    Username = r.User.Name,
                    UserId = r.User.Id,
                    ServiceName = r.Service.ServiceName
                })
                .ToListAsync();

            return Ok(pendingRatings);
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

        // DELETE: api/ServiceRequests/Reject
        [HttpDelete("Reject/{requestId}/{vendorId}")]
        public async Task<IActionResult> RejectServiceRequest(int requestId, int vendorId)
        {
            var serviceRequest = await _context.ServiceRequests.FindAsync(requestId);
            if (serviceRequest == null)
            {
                return NotFound(new { Message = "Service request not found." });
            }

            var pendingLog = await _context.PendingLogs
                .FirstOrDefaultAsync(pl => pl.RequestId == requestId && pl.VendorId == vendorId);
            if (pendingLog != null)
            {
                _context.PendingLogs.Remove(pendingLog);
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

    
    public class UpdateServiceRequestDto : CreateServiceRequestDto
    {
        public int Id { get; set; }
    }

    public class AcceptServiceRequestDto
    {
        public int Id { get; set; } 
        public bool IsCompleted { get; set; } = true; 
        public float Price { get; set; }
    }

    public class ServiceRequestDto
    {
        public int Id { get; set; }
        public string Description { get; set; }
        public string Area { get; set; }
        public float Price { get; set; }
        public bool IsCompleted { get; set; }
        public DateTime PostedOn { get; set; }
        public DateTime RequestedTime {get; set; }
        public string Username { get; set; }
        public int UserId { get; set; }
        public string ServiceName { get; set; }
    }
    public class ServiceIDRequestDto
    {
        public int Id { get; set; }
    }
}
