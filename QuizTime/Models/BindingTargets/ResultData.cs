using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace QuizTime.Models.BindingTargets
{
    public class ResultData
    {
        public int Score { get; set; }

        public string SessionParticipant { get; set; }

        public long Session { get; set; }

        public long Choice { get; set; }

        public Result Result => new Result
        {
            Score = Score,
            SessionParticipant = SessionParticipant.Length == 0 ? null : new User
            {
                Username = SessionParticipant
            },
            Session = Session == 0 ? null : new Session
            {
                GeneratedHostId = Session
            },
            Choice = Choice == 0 ? null : new Choice
            {
                ChoiceId = Choice
            }
        };
    }
}
