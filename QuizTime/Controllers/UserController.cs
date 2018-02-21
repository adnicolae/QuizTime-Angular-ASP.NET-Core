using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using QuizTime.Data;

namespace QuizTime.Controllers
{
    public class EditUserData
    {
        public string Name { get; set; }
        public string DefaultQuizTitle { get; set; }
    }

    [Produces("application/json")]
    [Route("api/users")]
    public class UserController : Controller
    {
        private Context _context;

        public UserController(Context context)
        {
            this._context = context;
        }

        [HttpGet("{id}")]
        public ActionResult Get(long id)
        {
            var user = _context.Users.SingleOrDefault(u => u.UserId == id);

            if (user == null)
            {
                return NotFound("User not found.");
            }

            return Ok(user);
        }

        [Authorize]
        [HttpGet("me")]
        public ActionResult Get()
        {
            return Ok(GetSecureUser());
        }

        [Authorize]
        [HttpPost("me")]
        public ActionResult Post([FromBody] EditUserData userData)
        {
            var user = GetSecureUser();

            user.Name = userData.Name ?? user.Name;
            user.DefaultQuizTitle = userData.DefaultQuizTitle ?? user.DefaultQuizTitle;

            _context.SaveChanges();

            return Ok(user);
        }

        Models.User GetSecureUser()
        {
            // Returns a collection of all claims that were setup. The middleware takes the subject claim and maps it to NameIdentifier property, though the claim is the Id, not the user's Name.
            var id = HttpContext.User.Claims.First().Value;
            return _context.Users.SingleOrDefault(u => u.UserId.ToString().Equals(id));
        }
    }
}