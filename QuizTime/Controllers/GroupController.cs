using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using QuizTime.Data;
using QuizTime.Models;
using QuizTime.Models.BindingTargets;

namespace QuizTime.Controllers
{
    [Produces("application/json")]
    [Route("api/groups")]
    public class GroupController : Controller
    {
        private Context _context;

        public GroupController(Context context)
        {
            _context = context;
        }

        [HttpGet("{id}")]
        public Group GetGroup(long id, string username)
        {
            Group group = _context.Groups
                .Include(g => g.Owner)
                .Include(g => g.Quizzes)
                .FirstOrDefault(g => g.GroupId == id && g.Owner.Username == username);

            if (group != null)
            {
                if (group.Owner != null)
                {
                    group.Owner.QuizzesCreated = null;
                }
                if (group.Quizzes.Count() > 0)
                {
                    group.Quizzes.ForEach(q =>
                    {
                        q.Creator.QuizzesCreated = null;
                        q.Group = null;
                    });
                }
            }

            return group;
        }

        [Authorize]
        [HttpGet]
        [Route("user")]
        public IEnumerable<Group> GetGroups()
        {
            var user = GetSecureUser();
            IQueryable<Group> query = _context.Groups;

            query = query
                .Include(g => g.Owner)
                .Include(g => g.Members)
                .Include(g => g.Quizzes);

            query = query.Where(g => g.Owner.Username == user.Username);
            List<Group> data = query.ToList();

            data.ForEach(g =>
            {
                if (g.Owner.QuizzesCreated != null)
                {
                    g.Owner.QuizzesCreated = null;
                }

                if (g.Quizzes.Count() > 0)
                {
                    g.Quizzes.ForEach(q => { q.Group = null; q.Creator = null; });
                }
            });

            if (data.Count() > 0)
            {
                return data;
            }
            else
            {
                return null;
            }
        }

        [HttpPost]
        public IActionResult CreateGroup([FromBody] GroupData groupData)
        {
            if (ModelState.IsValid)
            {
                Group group = groupData.Group;

                User user = _context.Users.SingleOrDefault(u => u.Username == groupData.Owner);

                if (user != null)
                {
                    group.Owner = user;
                    _context.Attach(user);
                }
                else
                {
                    return NotFound("Group owner not found");
                }

                _context.Add(group);
                _context.SaveChanges();
                return Ok(group);
            }
            else
            {
                return BadRequest(ModelState);
            }
        }

        Models.User GetSecureUser()
        {
            // Returns a collection of all claims that were setup. The middleware takes the subject claim and maps it to NameIdentifier property, though the claim is the Id, not the user's Name.
            var id = HttpContext.User.Claims.First().Value;
            return _context.Users.SingleOrDefault(u => u.UserId.ToString().Equals(id));
        }
    }
}