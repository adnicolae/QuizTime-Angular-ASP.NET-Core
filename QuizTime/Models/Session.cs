using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace QuizTime.Models
{
    public class Session
    {
        public long SessionId { get; set; }
        // time limit in seconds
        public int TimeLimit { get; set; }

        // the results of all users that participated
        public ICollection<Result> Results { get; set; }
        // the quiz that was run during the session
        public Quiz Quiz { get; set; }
    }
}
