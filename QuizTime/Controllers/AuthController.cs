using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.IdentityModel.Tokens.Jwt;
using QuizTime.Models;
using QuizTime.Data;
using System.Security.Claims;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using System.ComponentModel.DataAnnotations;
using QuizTime.Models.BindingTargets;

namespace QuizTime.Controllers
{
    // Class to model a Jwt token packet
    public class JwtPacket
    {
        public string Token { get; set; }
        public string Username { get; set; }
        public string Name { get; set; }
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
            [Required]
            [MaxLength(10, ErrorMessage = "Username cannot exceed 10 characters.")]
            public string Username { get; set; }
            [Required]
            public string Password { get; set; }
        }

        [HttpPost("login")]
        public ActionResult Login([FromBody] LoginData loginData)
        {
            //var user = _context.Users.SingleOrDefault(u => u.Username == loginData.Username && u.Password == loginData.Password);
            if (ModelState.IsValid)
            {
                var user = _context.Users.SingleOrDefault(u => u.Username == loginData.Username);

                if (user == null)
                {
                    return BadRequest("The username provided doesn't belong to an account. Please check the username and try again.");
                } else if (user.Password != loginData.Password)
                {
                    return BadRequest("Sorry, the password provided is incorrect. Please double-check your password.");
                }

                return Ok(CreateJwtPacket(user));
            } else
            {
                return BadRequest(ModelState);
            }
            
        }

        [HttpPost("register")]
        public ActionResult Register([FromBody] User user)
        {
            if (ModelState.IsValid)
            {
                var findUser = _context.Users.SingleOrDefault(u => u.Username == user.Username);
                if (findUser != null)
                {
                    return BadRequest("Sorry, the username already exists. Please log in or choose a different username.");
                }
                _context.Users.Add(user);
                _context.SaveChanges();

                return Ok(CreateJwtPacket(user));
            } else
            {
                return BadRequest(ModelState);
            }
        }

        JwtPacket CreateJwtPacket(User user)
        {
            var signingKey = new SymmetricSecurityKey(System.Text.Encoding.UTF8.GetBytes("this is the secure phrase custom test"));
            var signingCredentials = new SigningCredentials(signingKey, SecurityAlgorithms.HmacSha256);

            var claims = new Claim[]
            {
                new Claim(JwtRegisteredClaimNames.Sub, user.UserId.ToString())
            };


            // Create a raw JWT token.
            var jwt = new JwtSecurityToken(claims: claims, signingCredentials: signingCredentials);

            // Encode the token - returns a string
            var encodedJwt = new JwtSecurityTokenHandler().WriteToken(jwt);

            return new JwtPacket() { Token = encodedJwt, Username = user.Username, Name = user.Name };
        }
    }
}