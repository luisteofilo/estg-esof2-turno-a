using System.Security.Cryptography;
using System.Text;
using ESOF.WebApp.DBLayer.Context;
using ESOF.WebApp.DBLayer.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ESOF.WebApp.WebAPI.Controllers
{
    [Route("/logincontroller")]
    [ApiController]
    public class Login : ControllerBase
    {
        [HttpPost]
        public async Task<IActionResult> LoginUser([FromBody] UserDTO userDTO)
        {
            var db = new ApplicationDbContext();
            var user = await db.Users.SingleOrDefaultAsync(u => u.Email == userDTO.Email);

            if (user == null)
            {
                return BadRequest("Invalid email or password.");
            }

            using var hmac = new HMACSHA512(user.PasswordSalt);
            var computedHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(userDTO.Password));

            for (int i = 0; i < computedHash.Length; i++)
            {
                if (computedHash[i] != user.PasswordHash[i])
                {
                    return BadRequest("Invalid email or password.");
                }
            }

            return Ok("Login successful.");
        }
    }
}
