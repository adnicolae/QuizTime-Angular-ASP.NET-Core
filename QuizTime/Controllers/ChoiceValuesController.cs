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
    [Route("api/choices")]
    public class ChoiceValuesController : Controller
    {
        private Context _context;

        public ChoiceValuesController(Context context)
        {
            _context = context;
        }

        [HttpGet("{id}")]
        public Choice GetChoice(long id)
        {
            Choice choice = _context.Choices
                .Include(c => c.Quiz)
                .FirstOrDefault(c => c.ChoiceId == id);

            if (choice != null)
            {
                if (choice.Quiz != null)
                {
                    foreach(Choice c in choice.Quiz.Choices)
                    {
                        c.Quiz = null;
                    }
                }
            }

            return choice;
        }

        [HttpPost]
        public IActionResult CreateChoice([FromBody] ChoiceData choiceData)
        {
            if (ModelState.IsValid)
            {
                Choice choice = choiceData.Choice;

                if (choice.Quiz != null && choice.Quiz.QuizId != 0){
                    _context.Attach(choice.Quiz);
                }

                _context.Add(choice);
                _context.SaveChanges();
                return Ok(choice.ChoiceId);
            }
            else
            {
                return BadRequest(ModelState);
            }
        }
    }
}
