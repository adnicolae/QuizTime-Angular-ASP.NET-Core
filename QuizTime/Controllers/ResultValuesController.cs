﻿using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using QuizTime.Data;
using QuizTime.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace QuizTime.Controllers
{
    [Route("api/results")]
    public class ResultValuesController : Controller
    {
        private Context _context;
        public ResultValuesController(Context context)
        {
            _context = context;
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

        [HttpGet]
        public IEnumerable<Result> GetResults(string search, long participantId, long sessionCreatorId, bool related = false, bool specific = false)
        {
            IQueryable<Result> query = _context.Results;

            if (!string.IsNullOrWhiteSpace(search))
            {
                string searchLower = search.ToLower();

                query = query.Where(r => r.Session.Quiz.Title.ToLower().Contains(search));
            }

            if (specific)
            {
                if (participantId > 0)
                {
                    query = query.Where(r => r.SessionParticipant.UserId == participantId);
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
                        .ThenInclude(r => r.Quiz);

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

                    if (r.Session.Quiz != null)
                    {
                        r.Session.Quiz.Creator = null;
                    }
                });
                return data;
            }
            else
            {
                return query;
            }

        }
    }
}
