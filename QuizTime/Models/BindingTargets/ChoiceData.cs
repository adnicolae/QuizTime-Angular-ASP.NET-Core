using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace QuizTime.Models.BindingTargets
{
    public class ChoiceData
    {
        [Required]
        public string Title { get; set; }

        [Required]
        public bool Correctness { get; set; }

        public long Quiz { get; set; }

        public Choice Choice => new Choice
        {
            Title = Title,
            Correctness = Correctness,
            Quiz = Quiz == 0 ? null : new Quiz
            {
                QuizId = Quiz
            }
        };
    }
}
