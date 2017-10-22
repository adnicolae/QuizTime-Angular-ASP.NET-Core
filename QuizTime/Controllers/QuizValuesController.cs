using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using QuizTime.Data;
using QuizTime.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace QuizTime.Controllers
{
    [Route("api/quizzes")]
    public class QuizValuesController : Controller
    {
        private Context _context;

        public QuizValuesController(Context context)
        {
            _context = context;
        }

        [HttpGet("{id}")]
        public Quiz GetQuiz(long id)
        {
            Quiz quiz = _context.Quizzes
                .Include(q => q.Creator)
                .Include(q => q.Choices)
                .FirstOrDefault(q => q.QuizId == id);

            if (quiz != null)
            {
                if (quiz.Choices != null)
                {
                    foreach (Choice choice in quiz.Choices)
                    {
                        choice.Quiz = null;
                    }
                }

                if (quiz.Creator != null)
                {
                    quiz.Creator.QuizzesCreated = null;
                    quiz.Creator.Results = null;
                }
            }

            return quiz;
        }

        [HttpGet]
        public IEnumerable<Quiz> GetQuizzes(string search, int creatorId = 1, bool related = false)
        {
            IQueryable<Quiz> query = _context.Quizzes;
            query = query.Where(q => q.Creator.UserId == creatorId);

            if (!string.IsNullOrWhiteSpace(search))
            {
                string searchLower = search.ToLower();

                query = query.Where(q => q.Title.ToLower().Contains(search));
            }

            if (related)
            {
                query = query
                    .Include(q => q.Creator)
                    .Include(q => q.Choices);

                List<Quiz> data = query.ToList();

                data.ForEach(q =>
                {
                    if (q.Choices != null)
                    {
                        foreach (Choice choice in q.Choices)
                        {
                            choice.Quiz = null;
                        }
                    }

                    if (q.Creator != null)
                    {
                        q.Creator.QuizzesCreated = null;
                        q.Creator.Results = null;
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
