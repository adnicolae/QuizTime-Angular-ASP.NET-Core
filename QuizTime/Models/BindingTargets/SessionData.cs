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
        public int TimeLimit { get; set; }

        [Required]
        public DateTime DateCreated { get; set; }

        [Range(0, 9999, ErrorMessage = "Generated id should be less than 9999")]
        public long GeneratedHostId { get; set; }

        [Required]
        public SessionStatus Status { get; set; }

        public long Quiz { get; set; }

        public Session Session => new Session
        {
            TimeLimit = TimeLimit,
            DateCreated = DateCreated,
            GeneratedHostId = GeneratedHostId,
            Status = SessionStatus.Created,
            Quiz = Quiz == 0 ? null : new Quiz { QuizId = Quiz }
        };
    }
}
