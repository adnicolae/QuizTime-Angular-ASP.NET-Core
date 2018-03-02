using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace QuizTime.Models.BindingTargets
{
    public class SessionData
    {
        [Required]
        public DateTime DateCreated { get => Session.DateCreated; set => Session.DateCreated = value; }

        [Required]
        [Range(0, 9999, ErrorMessage = "Generated id should be less than 9999")]
        public long GeneratedHostId { get => Session.GeneratedHostId; set => Session.GeneratedHostId = value; }

        [Required]
        public SessionStatus Status { get => Session.Status; set => Session.Status = value; }

        public long? SelectedToExplain
        {
            get => Session.SelectedToExplain?.UserId ?? null; set
            {
                if (!value.HasValue)
                {
                    Session.SelectedToExplain = null;
                }
                else
                {
                    if (Session.SelectedToExplain == null)
                    {
                        Session.SelectedToExplain = new User();
                    }
                    Session.SelectedToExplain.UserId = value.Value;
                }
            }
        }

        public long? Quiz { get => Session.Quiz?.QuizId ?? null; set {
                if (!value.HasValue)
                {
                    Session.Quiz = null;
                } else
                {
                    if (Session.Quiz == null)
                    {
                        Session.Quiz = new Quiz();
                    }
                    Session.Quiz.QuizId = value.Value;
                }
            }
        }

        public Session Session { get; set; } = new Session();
    }
}
