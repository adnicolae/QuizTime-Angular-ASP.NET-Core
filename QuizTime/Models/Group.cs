using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace QuizTime.Models
{
    public class Group
    {
        public Group()
        {
            Members = new List<User>();
            Quizzes = new List<Quiz>();
        }
        public long GroupId { get; set; }
        public string Title { get; set; }
        public User Owner { get; set; }
        public DateTime DateCreated { get; set; }
        public List<User> Members { get; set; }
        public List<Quiz> Quizzes { get; set; }
    }
}
