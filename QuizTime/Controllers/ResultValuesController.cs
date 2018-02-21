﻿using Microsoft.AspNetCore.JsonPatch;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using QuizTime.Data;
using QuizTime.Hubs;
using QuizTime.Models;
using QuizTime.Models.BindingTargets;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

// OPEN XML 
namespace QuizTime.Controllers
{
    [Route("api/results")]
    public class ResultValuesController : Controller
    {
        private Context _context;
        private IHubContext<QuizHub> _quizHubContext;
        private IHubContext<SessionBoardHub> _boardHubContext;

        public ResultValuesController(Context context, IHubContext<QuizHub> quizHubContext, IHubContext<SessionBoardHub> boardHubContext)
        {
            _context = context;
            _quizHubContext = quizHubContext;
            _boardHubContext = boardHubContext;
        }
        
        [HttpGet("{id}")]
        public Result GetResult(long id)
        {
            Result result = _context.Results
                .Include(r => r.SessionParticipant)
                .Include(r => r.Session)
                    .ThenInclude(s => s.Quiz)
                .Include(r => r.Choice)
                .FirstOrDefault(r => r.ResultId == id);

            if (result != null)
            {
                if (result.SessionParticipant != null)
                {
                    result.SessionParticipant.QuizzesCreated = null;
                    result.SessionParticipant.Results = null;
                }

                if (result.Session != null)
                {
                    result.Session.Results = null;
                }
            }
            return result;
        }

        //[HttpGet]
        //public int GetResults(string userDefault)
        //{
        //    IQueryable<Result> query = _context.Results;

        //    // Sum all results for the same quiz title where the quiz title is also the user's default 
        //    return query.Where(r => r.Session.Quiz.Title == r.Session.Quiz.Creator.DefaultQuizTitle).Sum(r => r.Score);
        //}

        [HttpGet]
        public IEnumerable<Result> GetResults(string search, string participantUsername, long sessionCreatorId, int last, bool related = false, bool specific = false)
        {
            IQueryable<Result> query = _context.Results;

            if (!string.IsNullOrWhiteSpace(search))
            {
                string searchLower = search.ToLower();

                query = query.Where(r => r.Session.Quiz.Title.ToLower().Contains(search));
            }

            if (specific)
            {
                if (participantUsername.Length > 0)
                {
                    query = query.Where(r => r.SessionParticipant.Username == participantUsername);
                }

                if (sessionCreatorId > 0)
                {
                    query = query.Where(r => r.Session.Quiz.Creator.UserId == sessionCreatorId);
                }
            }

            if (related)
            {
                query = query
                    .Include(r => r.SessionParticipant)
                    .Include(r => r.Session)
                        .ThenInclude(r => r.Quiz)
                        .ThenInclude(q => q.Creator)
                    .Include(r => r.Choice);

                List<Result> data = query.ToList();

                data.ForEach(r =>
                {
                    if (r.SessionParticipant != null)
                    {
                        r.SessionParticipant.Results = null;
                        r.SessionParticipant.QuizzesCreated = null;
                    }

                    if (r.Session != null)
                    {
                        r.Session.Results = null;
                    }

                    if (r.Session != null && r.Session.Quiz != null)
                    {
                        r.Session.Quiz.Creator.Results = null;
                        r.Session.Quiz.Creator.QuizzesCreated = null;
                        r.Session.Quiz.Creator.Password = null;
                    }

                    //if (r.Session != null && r.Session.Quiz != null)
                    //{
                    //    r.Session.Quiz.Creator = null;
                    //}

                    if (r.Choice != null)
                    {
                        r.Choice.Quiz = null;
                    }
                });

                if (last > 0 && data.Count() > 0)
                {
                    return data.TakeLast(last);
                }

                return data;
            }
            else
            {
                return query;
            }
        }

        [HttpPost]
        public IActionResult CreateResult([FromBody] ResultData resultData)
        {
            if (ModelState.IsValid)
            {
                Result result = resultData.Result;

                // Check if the user exists
                User user = _context.Users.SingleOrDefault(u => u.Username == resultData.SessionParticipant);

                // Attach the existing user to the result
                if (user != null)
                {
                    result.SessionParticipant = user;
                    _context.Attach(user);
                } // Create a temporary user using the username provided
                else if (resultData.SessionParticipant != null && resultData.SessionParticipant.Length > 0)
                {
                    result.SessionParticipant = new User
                    {
                        Username = resultData.SessionParticipant
                    };

                    _context.Attach(result.SessionParticipant);
                }

                if (result.Session != null && result.Session.SessionId != 0)
                {
                    _context.Attach(result.Session);
                }

                if (result.Choice != null && result.Choice.ChoiceId != 0)
                {
                    _context.Attach(result.Choice);
                }

                _context.Add(result);
                _context.SaveChanges();

                //_quizHubContext.Clients.All.InvokeAsync("send", "Hello, player " + result.SessionParticipant.Username + " joined session " + result.Session.GeneratedHostId);

                _boardHubContext.Clients.All.InvokeAsync("send", result.SessionParticipant.Username);

                return Ok(result.ResultId);
            }
            else
            {
                return BadRequest(ModelState);
            }
        }

        [HttpPatch("{id}")]
        public IActionResult UpdateResult(long id, [FromBody] JsonPatchDocument<ResultPatchData> patch)
        {
            Result result = _context.Results
                .Include(r => r.SessionParticipant)
                .Include(r => r.Session)
                .Include(r => r.Choice)
                .First(r => r.ResultId == id);

            ResultPatchData resultData = new ResultPatchData { Result = result };

            patch.ApplyTo(resultData, ModelState);

            if (ModelState.IsValid && TryValidateModel(resultData))
            {
                if (result.SessionParticipant != null && result.SessionParticipant.UserId != 0)
                {
                    _context.Attach(result.SessionParticipant);
                }

                if (result.Session != null && result.Session.SessionId != 0)
                {
                    _context.Attach(result.Session);
                }

                if (result.Choice != null && result.Choice.ChoiceId != 0)
                {
                    _context.Attach(result.Choice);
                }

                _context.SaveChanges();
                //_boardHubContext.Clients.All.InvokeAsync("send", "Updating results");

                return Ok();
            }
            else
            {
                return BadRequest(ModelState);
            }
        }
    }
}
