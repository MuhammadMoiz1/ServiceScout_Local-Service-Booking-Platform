using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Identity; // Add this line
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Backend.Dtos;
using Backend.Data;
using Backend.Authentication;

namespace Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly JwtService _jwtService;

        public AuthController(AppDbContext context, JwtService jwtService)
        {
            _context = context;
            _jwtService = jwtService;
        }

        [HttpPost("login")]
        public IActionResult Login([FromBody] LoginRequest request)
        {
            var user = _context.Users.FirstOrDefault(u => u.Email == request.Email);
            if (user == null)
            {
                return Unauthorized("Invalid credentials");
            }

            // Verify the password against the stored hash
            var passwordHasher = new PasswordHasher<User>();
            var passwordVerificationResult = passwordHasher.VerifyHashedPassword(user, user.PasswordHash, request.Password);

            if (passwordVerificationResult == PasswordVerificationResult.Failed)
            {
                return Unauthorized("Invalid credentials");
            }

            var token = _jwtService.GenerateToken(user.Id, user.Email, "User");
            return Ok(new AuthResponse { Token = token, Role = "User" });
        }

        [HttpPost("login-vendor")]
        public IActionResult LoginVendor([FromBody] LoginRequest request)
        {
            var vendor = _context.ServiceVendors.FirstOrDefault(v => v.Email == request.Email);
            if (vendor == null)
            {
                return Unauthorized("Invalid credentials");
            }

            // Verify the password against the stored hash
            var passwordHasher = new PasswordHasher<ServiceVendor>();
            var passwordVerificationResult = passwordHasher.VerifyHashedPassword(vendor, vendor.PasswordHash, request.Password);

            if (passwordVerificationResult == PasswordVerificationResult.Failed)
            {
                return Unauthorized("Invalid credentials");
            }

            var token = _jwtService.GenerateToken(vendor.Id, vendor.Email, "Vendor");
            return Ok(new AuthResponse { Token = token, Role = "Vendor" });
        }

        [HttpPost("signup")]
        public async Task<IActionResult> SignupUser([FromBody] SignupRequest request)
        {
            if (_context.Users.Any(u => u.Email == request.Email))
                return BadRequest("Email is already in use.");
            if (_context.Users.Any(u => u.CnicNumber == request.CnicNumber))
                return BadRequest("CNIC is already in use.");

            var user = new User
            {
                Name = request.Name,
                Area = request.Area,
                CnicNumber = request.CnicNumber,
                Rating = 0,
                TotalOrders = 0,
                Email = request.Email,
                PasswordHash = HashPassword(request.Password), // Hash password
                ContactInfo = request.ContactInfo
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();
            return Ok("User registered successfully!");
        }

        [HttpPost("signup-vendor")]
        public async Task<IActionResult> SignupVendor([FromBody] SignupRequest request)
        {
            if (_context.ServiceVendors.Any(v => v.Email == request.Email))
                return BadRequest("Email is already in use.");
            if (_context.ServiceVendors.Any(v => v.CnicNumber == request.CnicNumber))
                return BadRequest("CNIC is already in use.");

            var vendor = new ServiceVendor
            {
                Name = request.Name,
                Area = request.Area,
                CnicNumber = request.CnicNumber,
                Rating = 0,
                TotalRevenue = 0,
                TotalOrders = 0,
                Email = request.Email,
                PasswordHash = HashPassword(request.Password),
                ContactInfo = request.ContactInfo
            };

            _context.ServiceVendors.Add(vendor);
            await _context.SaveChangesAsync();

            // Save selected services for the vendor
            if (request.ServiceIds != null && request.ServiceIds.Any())
            {
                var serviceLinks = request.ServiceIds.Select(serviceId => new ServiceProviderServiceLink
                {
                    ServiceVendorId = vendor.Id, // Newly created vendor's ID
                    VendorServiceId = serviceId
                });

                _context.ServiceProviderServiceLinks.AddRange(serviceLinks);
                await _context.SaveChangesAsync();
            }

            return Ok("Service vendor registered successfully!");
        }


        private string HashPassword(string password)
        {
            var passwordHasher = new PasswordHasher<User>();
            return passwordHasher.HashPassword(null, password);
        }
    }
}
