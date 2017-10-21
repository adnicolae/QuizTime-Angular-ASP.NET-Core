using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace QuizTime.Models
{
    public class Choice
    {
        public long ChoiceId { get; set; }
        public string Title { get; set; }
        public bool Correctness { get; set; }

        // the quiz to whom this choice belongs
        public Quiz Quiz { get; set; }
    }
}
