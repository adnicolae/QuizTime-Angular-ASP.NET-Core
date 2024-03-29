﻿using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace QuizTime.Models
{
    public class User
    {
        public User()
        {
            QuizzesCreated = new List<Quiz>();
            Results = new List<Result>();
        }
        public long UserId { get; set; }
        public string Name { get; set; }
        public string Username { get; set; }
        public string Password { get; set; }
        public string DefaultQuizTitle { get; set; }
        public byte[] Salt { get; set; }

        public ICollection<Quiz> QuizzesCreated { get; set; }
        public ICollection<Result> Results { get; set; }
    }
}
