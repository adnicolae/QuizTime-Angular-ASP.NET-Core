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
        public DateTime DateCreated { get; set; }

        // the results of all users that participated
        public ICollection<Result> Results { get; set; }
        // the quiz that was run during the session
        public Quiz Quiz { get; set; }

        //add enum with session status: Created / InProgress / Complete
        // signalr for: when a client/user joins a session, his name appears in the teacher's page immediately ( this might be solved with angular only )
        // signalr for: after the users joined the session and the teacher presses start session, the question and all it's quizzes should appear to those users connected to it
    }
}
