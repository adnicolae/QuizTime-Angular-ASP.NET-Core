using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace QuizTime.Models
{
    public class Session
    {
        public long SessionId { get; set; }
        public DateTime DateCreated { get; set; }
        public long GeneratedHostId { get; set; }
        public SessionStatus Status { get; set; }
        public User SelectedToExplain { get; set; }

        // the results of all users that participated
        public ICollection<Result> Results { get; set; }
        // the quiz that was run during the session
        public Quiz Quiz { get; set; }
    }

    public enum SessionStatus
    {
        None,
        WaitingForPlayersToJoin,
        TimerBeforeQuestion,
        DisplayQuestionOrChoices,
        DisplayCorrectResult,
        ExplainAnswer,
        Voting,
        QuizEnd
    }
}
