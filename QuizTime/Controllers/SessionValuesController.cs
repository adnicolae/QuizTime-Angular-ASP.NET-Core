using Microsoft.AspNetCore.JsonPatch;
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
                    .ThenInclude(r => r.SessionParticipant)
                .Include(s => s.Quiz)
                .FirstOrDefault(s => s.SessionId == id);

            if (session != null)
            {
                if (session.Results != null)
                {
                    foreach (Result result in session.Results)
                    {
                        result.Session = null;
                        result.SessionParticipant.Results = null;
                    }
                }
            }

            return session;
        }
        
        [HttpGet]
        public IEnumerable<Session> GetSessions()
        {
            IQueryable<Session> query = _context.Sessions;
            query = query
                .Include(s => s.Quiz);

            return query;
        }

        [HttpGet]
        [Route("host/{hostId:long}")]
        public Session GetHostedSession(long hostId)
        {
            Session session = _context.Sessions
                .Include(s => s.Results)
                    .ThenInclude(r => r.SessionParticipant)
                .Include(s => s.Quiz)
                    .ThenInclude(q => q.Choices)
                .FirstOrDefault(s => (s.GeneratedHostId == hostId));

            if (session != null)
            {
                if (session.Results != null)
                {
                    foreach (Result result in session.Results)
                    {
                        result.Session = null;
                        result.SessionParticipant.Results = null;
                    }
                }

                if (session.Quiz != null)
                {
                    foreach (Choice choice in session.Quiz.Choices)
                    {
                        choice.Quiz = null;
                    }
                }
            }

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

        /// <summary>
        /// Method used to update an existing session record.
        /// </summary>
        /// <param name="id">The id used to identify the session that is being modified.</param>
        /// <param name="patch">The JSON Patch document.</param>
        /// <returns>200 if the request was correct, 500 otherwise</returns>
        [HttpPatch("{id}")]
        public IActionResult UpdateSession(long id, [FromBody]JsonPatchDocument<SessionData> patch)
        {
            Session session = _context.Sessions
                .Include(s => s.Quiz)
                .First(s => s.SessionId == id);

            SessionData sessionData = new SessionData { Session = session };

            patch.ApplyTo(sessionData, ModelState);

            if (ModelState.IsValid && TryValidateModel(sessionData))
            {
                if (session.Quiz != null && session.Quiz.QuizId != 0)
                {
                    _context.Attach(session.Quiz);
                }
                _context.SaveChanges();
                return Ok();
            } else
            {
                return BadRequest(ModelState);
            }
        }
    }
}
