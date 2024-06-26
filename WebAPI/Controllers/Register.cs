using Microsoft.AspNetCore.Mvc;
using ESOF.WebApp.DBLayer.Context;
using ESOF.WebApp.DBLayer.Entities;
using System.Security.Cryptography;
using System.Text;
using Microsoft.EntityFrameworkCore;

namespace ESOF.WebApp.WebAPI.Controllers
{
    [ApiController]
    [Route("/register")]
    public class RegisterController : ControllerBase
    {

        [HttpPost]
        public async Task<IActionResult> RegisterUser([FromBody] UserDTO userDTO)
        {
            var db = new ApplicationDbContext();
            if (await db.Users.AnyAsync(u => u.Email == userDTO.Email))
            {
                return BadRequest("User with this email already exists.");
            }

            using var hmac = new HMACSHA512();
            var user = new User
            {
                UserId = Guid.NewGuid(),
                Email = userDTO.Email,
                PasswordHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(userDTO.Password)),
                PasswordSalt = hmac.Key
            };

            await db.Users.AddAsync(user);
            await db.SaveChangesAsync();
            return Ok("Registration successful.");
        }
    }
}
