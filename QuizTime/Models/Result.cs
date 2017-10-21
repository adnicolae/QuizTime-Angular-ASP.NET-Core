using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace QuizTime.Models
{
    public class Result
    {
        public long ResultId { get; set; }
        public int Score { get; set; }

        // The user who obtained that score
        public User User { get; set; }
        // The session where he obtained that score
        public Session Session { get; set; }
    }
}
