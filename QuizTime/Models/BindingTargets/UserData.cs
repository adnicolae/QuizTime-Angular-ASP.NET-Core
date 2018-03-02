using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace QuizTime.Models.BindingTargets
{
    public class UserData
    {
        public UserData()
        {
            QuizzesCreated = new List<Quiz>();
            Results = new List<Result>();
        }
        public long UserId { get; set; }
        [Required]
        public string Name { get; set; }
        [Required]
        [MaxLength(10, ErrorMessage = "Username cannot exceed 10 characters.")]
        public string Username { get; set; }
        [Required]
        public string Password { get; set; }
        public string DefaultQuizTitle { get; set; }

        public ICollection<Quiz> QuizzesCreated { get; set; }
        public ICollection<Result> Results { get; set; }
    }
}
