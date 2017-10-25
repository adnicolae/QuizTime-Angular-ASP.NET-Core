using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using QuizTime.Data;
using QuizTime.Models;
using QuizTime.Models.BindingTargets;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace QuizTime.Controllers
{
    [Route("api/sessions")]
    public class SessionValuesController : Controller
    {
        private Context _context;

        public SessionValuesController(Context context)
        {
            _context = context;
        }

        [HttpGet("{id}")]
        public Session GetSession(long id)
        {
            Session session = _context.Sessions
                .Include(s => s.Results)
                .Include(s => s.Quiz)
                .FirstOrDefault(s => s.SessionId == id);

            if (session != null)
            {
                if (session.Results != null)
                {
                    foreach (Result result in session.Results)
                    {
                        result.Session = null;
                    }
                }
            }

            return session;
        }

        [HttpGet]
        [Route("host/{hostId:long}")]
        public Session GetHostedSession(long hostId)
        {
            Session session = _context.Sessions
                .Include(s => s.Quiz)
                .FirstOrDefault(s => (s.GeneratedHostId == hostId));
            return session;
        }

        [HttpPost]
        public IActionResult CreateSession([FromBody] SessionData sessionData)
        {
            if (ModelState.IsValid)
            {
                Session s = sessionData.Session;

                if (s.Quiz != null && s.Quiz.QuizId != 0)
                {
                    _context.Attach(s.Quiz);
                }
                _context.Add(s);
                _context.SaveChanges();
                return Ok(s.SessionId);
            }
            else
            {
                return BadRequest(ModelState);
            }
        }
    }
}
