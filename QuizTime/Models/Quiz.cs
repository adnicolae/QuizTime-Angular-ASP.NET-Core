using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
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
        public int TimeLimit { get; set; }
        public int AssignedPoints { get; set; }
        public int DeducedPoints { get; set; }
        public DateTime DateCreated { get; set; }

        public Group Group { get; set; }
        public User Creator { get; set; }
        public List<Choice> Choices { get; set; }
    }
}
