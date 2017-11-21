using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace QuizTime.Models.BindingTargets
{
    public class QuizData
    {
        [Required]
        public string Title { get; set; }

        [Required]
        public int TimeLimit { get; set; }

        [Range(0, int.MaxValue, ErrorMessage = "Points must be at least 0")]
        public int AssignedPoints { get; set; }

        [Range(0, int.MaxValue, ErrorMessage = "Points must be at least 0")]
        public int DeducedPoints { get; set; }

        [Required]
        public DateTime DateCreated { get; set; }

        // the key of the quiz creator
        public long Creator { get; set; }

        public Quiz Quiz => new Quiz
        {
            Title = Title,
            TimeLimit = TimeLimit,
            AssignedPoints = AssignedPoints,
            DeducedPoints = DeducedPoints,
            DateCreated = DateCreated,
            Creator = Creator == 0 ? null : new User
            {
                UserId = Creator
            }
        };
    }
}
