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
    public class ServiceOrdersController : ControllerBase
    {
        private readonly AppDbContext _context;

        public ServiceOrdersController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/ServiceOrders
        [HttpGet]
        public async Task<ActionResult<IEnumerable<ServiceOrder>>> GetServiceOrders()
        {
            var serviceOrders = await _context.ServiceOrders
                .Include(so => so.Request)       // Include the related ServiceRequest
                .Include(so => so.Vendor)        // Include the related ServiceVendor
                .ToListAsync();

            return Ok(serviceOrders);
        }
        [HttpGet("VendorOrders")]
        [Authorize(Roles = "Vendor")]
        public async Task<ActionResult<IEnumerable<ServiceOrderDto>>> GetVendorServiceOrders()
        {
            var currentVendorId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier));

            var serviceOrders = await _context.ServiceOrders
                .Where(so => so.VendorId == currentVendorId) 
                .Include(so => so.Request)                  
                    .ThenInclude(r => r.User)               
                .Include(so => so.Request.Service)          
                .Select(so => new ServiceOrderDto
                {
                    OrderId = so.Id,
                    RequestId = so.RequestId,
                    Status = so.Status,
                    ServiceName = so.Request.Service.ServiceName,
                    Description = so.Request.Description,
                    Area = so.Request.Area,
                    PostedOn = so.Request.PostedOn,
                    Price = (decimal)so.Request.Price,
                    UserName = so.Request.User.Name
                })
                .ToListAsync();

            return Ok(serviceOrders);
        }
        // GET: api/ServiceOrders/5
        [HttpGet("{id}")]
        public async Task<ActionResult<ServiceOrder>> GetServiceOrder(int id)
        {
            var serviceOrder = await _context.ServiceOrders
                .Include(so => so.Request)
                .Include(so => so.Vendor)
                .FirstOrDefaultAsync(so => so.Id == id);

            if (serviceOrder == null)
            {
                return NotFound();
            }

            return Ok(serviceOrder);
        }

        // POST: api/ServiceOrders
        [HttpPost]
        public async Task<ActionResult<ServiceOrder>> PostServiceOrder(CreateServiceOrderDto serviceOrderDto)
        {
            // Validate the RequestId and VendorId
            var serviceRequest = await _context.ServiceRequests.FindAsync(serviceOrderDto.RequestId);
            var serviceVendor = await _context.ServiceVendors.FindAsync(serviceOrderDto.VendorId);

            if (serviceRequest == null)
            {
                return BadRequest("Invalid RequestId.");
            }

            if (serviceVendor == null)
            {
                return BadRequest("Invalid VendorId.");
            }

            // Create the ServiceOrder from the DTO
            var serviceOrder = new ServiceOrder
            {
                RequestId = serviceOrderDto.RequestId,
                VendorId = serviceOrderDto.VendorId,
                Status = serviceOrderDto.Status
            };

            _context.ServiceOrders.Add(serviceOrder);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetServiceOrder), new { id = serviceOrder.Id }, serviceOrder);
        }

        // PATCH: api/ServiceVendors/{id}/IncrementOrders
        [HttpPatch("{id}/IncrementOrders")]
        public async Task<IActionResult> IncrementVendorOrders(int id)
        {
            // Find the vendor by ID
            var serviceVendor = await _context.ServiceVendors.FindAsync(id);

            if (serviceVendor == null)
            {
                return NotFound("Vendor not found.");
            }

            // Increment the TotalOrders
            serviceVendor.TotalOrders++;

            // Save changes to the database
            await _context.SaveChangesAsync();

            return Ok(new { Message = "Total orders updated successfully.", TotalOrders = serviceVendor.TotalOrders });
        }
        [HttpGet("userOrders")]
        [Authorize(Roles = "User")]
        public async Task<ActionResult<IEnumerable<int>>> GetAllOrderIdsForUser()
        {
            var currentUserId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier));
            var user = await _context.Users.FindAsync(currentUserId);

            if (user == null)
            {
                return BadRequest("Invalid UserId.");
            }

            var serviceOrderIds = await _context.ServiceOrders
                .Where(o => o.Request.UserId == currentUserId)  // Filter by user ID
                .Select(o => o.Id)  // Only select the ID of the service order
                .ToListAsync();

            if (serviceOrderIds == null || !serviceOrderIds.Any())
            {
                return NotFound();
            }

            return Ok(serviceOrderIds);
        }
        [HttpGet("userOrderHistory/{id}")]
        public async Task<ActionResult<ServiceOrderUserDto>> GetParticularServiceOrder(int id)
        {
            var serviceOrder = await _context.ServiceOrders
                .Where(o => o.Id == id)
                .Include(o => o.Request)
                .Include(o => o.Vendor)
                .FirstOrDefaultAsync();

            if (serviceOrder == null)
            {
                return NotFound();
            }

            var serviceOrderDto = new ServiceOrderUserDto
            {
                Id = serviceOrder.Id,
                Description = serviceOrder.Request.Description,
                RequestedOn = serviceOrder.Request.PostedOn,
                Amount = serviceOrder.Request.Price,
                VendorName = serviceOrder.Vendor.Name,
                VendorContactInfo = serviceOrder.Vendor.ContactInfo
            };

            return Ok(serviceOrderDto);
            }
         

        public class ServiceOrderUserDto
        {
        public int Id { get; set; }
        public string Description { get; set; }
        public DateTime RequestedOn { get; set; }
        public float Amount { get; set; }
        public string VendorName { get; set; }
        public string VendorContactInfo { get; set; }
        }


    // PUT: api/ServiceOrders/5
    [HttpPut("{id}")]
        public async Task<IActionResult> PutServiceOrder(int id, UpdateServiceOrderDto serviceOrderDto)
        {
            if (id != serviceOrderDto.Id)
            {
                return BadRequest();
            }

            // Validate the RequestId and VendorId
            var serviceRequest = await _context.ServiceRequests.FindAsync(serviceOrderDto.RequestId);
            var serviceVendor = await _context.ServiceVendors.FindAsync(serviceOrderDto.VendorId);

            if (serviceRequest == null)
            {
                return BadRequest("Invalid RequestId.");
            }

            if (serviceVendor == null)
            {
                return BadRequest("Invalid VendorId.");
            }

            var serviceOrder = await _context.ServiceOrders.FindAsync(id);
            if (serviceOrder == null)
            {
                return NotFound();
            }

            // Update the ServiceOrder from the DTO
            serviceOrder.RequestId = serviceOrderDto.RequestId;
            serviceOrder.VendorId = serviceOrderDto.VendorId;
            serviceOrder.Status = serviceOrderDto.Status;

            _context.Entry(serviceOrder).State = EntityState.Modified;
            await _context.SaveChangesAsync();

            return NoContent();
        }

        public class PendingRatingDto
        {
            public int ServiceOrderId { get; set; } 
            public string VendorName { get; set; } 
            public int VendorId { get; set; } 
            public string ServiceName { get; set; } 
            public DateTime RequestedTime { get; set; } 
            public decimal Rating { get; set; }
            public int RequestId {  get; set; } 
        }

        [HttpGet("get-pending-ratings")]
        [Authorize(Roles = "User")]
        public async Task<ActionResult<IEnumerable<PendingRatingDto>>> GetPendingRatings()
        {
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier));

            var pendingRatings = await _context.ServiceOrders
                .Include(so => so.Vendor)
                .Include(so => so.Request)
                .Where(so => so.Request.UserId == userId
                             && so.Status != "Rated"
                             && so.Request.RequestedTime <= DateTime.UtcNow.AddDays(-1)) // Check if the request is older than 1 day.
                .Select(so => new PendingRatingDto
                {
                    ServiceOrderId = so.Id,
                    VendorName = so.Vendor.Name,
                    VendorId = so.Vendor.Id,
                    ServiceName = so.Request.Description,
                    RequestedTime = so.Request.RequestedTime,
                    Rating= so.Vendor.Rating,
                    RequestId=so.Request.Id,
                })
                .ToListAsync();
            Console.WriteLine(pendingRatings);

            if (!pendingRatings.Any())
            {
                return NoContent();
            }

            return Ok(pendingRatings);
        }





        [HttpPost("rate")]
        [Authorize(Roles = "User")]
        public async Task<IActionResult> RateVendor(RatingDto ratingDto)
        {
            var serviceOrder = await _context.ServiceOrders
                .Include(so => so.Vendor)
                .FirstOrDefaultAsync(so => so.RequestId == ratingDto.RequestId && so.VendorId == ratingDto.VendorId);

            if (serviceOrder == null)
            {
                return NotFound("Service order not found.");
            }

            // Update vendor rating
            var vendor = serviceOrder.Vendor;
            if (vendor != null)
            {
                // Calculate and update vendor's rating
                vendor.Rating = (vendor.Rating * vendor.TotalOrders-1 + ratingDto.Rating) / (vendor.TotalOrders);  // Add +1 to TotalOrders for new rating

                // Change the ServiceOrder status to "Rated"
                serviceOrder.Status = "Rated";  // Set status to "Rated" after rating

                // Save changes to the database
                await _context.SaveChangesAsync();
            }

            return Ok("Rating submitted successfully.");
        }



        // DELETE: api/ServiceOrders/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteServiceOrder(int id)
        {
            var serviceOrder = await _context.ServiceOrders.FindAsync(id);
            if (serviceOrder == null)
            {
                return NotFound();
            }

            _context.ServiceOrders.Remove(serviceOrder);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool ServiceOrderExists(int id)
        {
            return _context.ServiceOrders.Any(so => so.Id == id);
        }
    }

    // DTO for creating a new ServiceOrder
    public class CreateServiceOrderDto
    {
        public int RequestId { get; set; }
        public int VendorId { get; set; }
        public string Status { get; set; }
    }

    // DTO for updating an existing ServiceOrder
    public class UpdateServiceOrderDto : CreateServiceOrderDto
    {
        public int Id { get; set; }
    }
    public class ServiceOrderDto
    {
        public int OrderId { get; set; }
        public int RequestId { get; set; }
        public string Status { get; set; }
        public string ServiceName { get; set; }
        public string Description { get; set; }
        public string Area { get; set; }
        public DateTime PostedOn { get; set; }
        public decimal Price { get; set; }
        public string UserName { get; set; }
    }

    public class RatingDto
    {
        public int VendorId { get; set; }
        public int RequestId { get; set; }
        public int Rating { get; set; } // Assuming 1-5 scale
    }


}
