using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.IdentityModel.Tokens.Jwt;
using QuizTime.Models;
using QuizTime.Data;

namespace QuizTime.Controllers
{
    // Class to model a Jwt token packet
    public class JwtPacket
    {
        public string Token { get; set; }
        public string Username { get; set; }
    }

    [Produces("application/json")]
    [Route("auth")]
    public class AuthController : Controller
    {
        private Context _context;

        public AuthController(Context context)
        {
            _context = context;
        }

        public class LoginData
        {
            public string Username { get; set; }
            public string Password { get; set; }
        }

        [HttpPost("login")]
        public ActionResult Login([FromBody] LoginData loginData)
        {
            var user = _context.Users.SingleOrDefault(u => u.Username == loginData.Username && u.Password == loginData.Password);

            if (user == null)
                return NotFound("username of password incorrect");

            return Ok(CreateJwtPacket(user));
        }

        [HttpPost("register")]
        public JwtPacket Register([FromBody] User user)
        {
            _context.Users.Add(user);
            _context.SaveChanges();

            return CreateJwtPacket(user);
        }

        JwtPacket CreateJwtPacket(User user)
        {
            // Create a raw JWT token.
            var jwt = new JwtSecurityToken();

            // Encode the token - returns a string
            var encodedJwt = new JwtSecurityTokenHandler().WriteToken(jwt);

            return new JwtPacket() { Token = encodedJwt, Username = user.Username };
        }
    }
}