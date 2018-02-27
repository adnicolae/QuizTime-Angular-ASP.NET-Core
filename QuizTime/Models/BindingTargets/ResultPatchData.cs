using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace QuizTime.Models.BindingTargets
{
    public class ResultPatchData
    {
        public int Score { get => Result.Score; set => Result.Score = value; }

        public long? SessionParticipant
        {
            get => Result.SessionParticipant?.UserId;
            set
            {
                if (!value.HasValue)
                {
                    Result.SessionParticipant = null;
                }
                else
                {
                    if (Result.SessionParticipant == null)
                    {
                        Result.SessionParticipant = new User();
                    }
                    Result.SessionParticipant.UserId = value.Value;
                }
            }
        }

        public long? Session
        {
            get => Result.Session?.SessionId ?? null;
            set
            {
                if (!value.HasValue)
                {
                    Result.Session = null;
                }
                else
                {
                    if (Result.Session == null)
                    {
                        Result.Session = new Session();
                    }
                    Result.Session.SessionId = value.Value;
                }
            }
        }

        public bool? ParticipatedSelection
        {
            get => Result.ParticipatedSelection;
            set
            {
                Result.ParticipatedSelection = value.Value;
            }
        }

        public bool? PositiveVote
        {
            get => Result.PositiveVote;
            set
            {
                Result.PositiveVote = value.Value;
            }
        }

        public long? Choice {
            get => Result.Choice?.ChoiceId ?? null;
            set
            {
                if (!value.HasValue)
                {
                    Result.Choice = null;
                } else
                {
                    if (Result.Choice == null)
                    {
                        Result.Choice = new Choice();
                    }
                    Result.Choice.ChoiceId = value.Value;
                }
            }
        }

        public Result Result { get; set; } = new Result();
    }
}
