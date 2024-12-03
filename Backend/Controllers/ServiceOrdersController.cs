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

}
