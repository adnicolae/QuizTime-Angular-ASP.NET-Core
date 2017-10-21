using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace QuizTime.Models
{
    public class Quiz
    {
        public Quiz()
        {
            Choices = new List<Choice>();
        }

        public long QuizId { get; set; }
        public string Title { get; set; }
        public int AssignedPoints { get; set; }

        public User Creator { get; set; }
        public ICollection<Choice> Choices { get; set; }
    }
}
