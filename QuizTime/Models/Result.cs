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
        public User SessionParticipant { get; set; }
        // The session where he obtained that score
        public Session Session { get; set; }
        // maybe add Choice to register what choice the user made in that session
        public Choice Choice { get; set; }
    }
}
