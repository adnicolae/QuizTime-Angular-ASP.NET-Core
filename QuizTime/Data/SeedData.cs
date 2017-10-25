using Microsoft.EntityFrameworkCore;
using QuizTime.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace QuizTime.Data
{
    public class SeedData
    {
        public static void SeedDatabase(Context context)
        {
            if (context.Database.GetMigrations().Count() > 0
                && context.Database.GetPendingMigrations().Count() == 0
                && context.Quizzes.Count() == 0)
            {
                var user1 = new User()
                {
                    Username = "John",
                    Password = "None"
                };

                var user2 = new User()
                {
                    Username = "Andrei",
                    Password = "None"
                };

                var choice1 = new Choice
                {
                    Title = "Choice1",
                    Correctness = true,
                };

                var choice2 = new Choice
                {
                    Title = "Choice2",
                    Correctness = false,
                };

                var choice3 = new Choice
                {
                    Title = "Choice3",
                    Correctness = false,
                };

                var choice4 = new Choice
                {
                    Title = "Choice4",
                    Correctness = false,
                };

                var choice1_alt = new Choice
                {
                    Title = "Choice1.2",
                    Correctness = false,
                };

                var choice3_alt = new Choice
                {
                    Title = "Choice3.2",
                    Correctness = true,
                };

                var choices1 = new List<Choice>
                {
                    choice1,
                    choice2,
                    choice3,
                    choice4,
                };

                var choices2 = new List<Choice>
                {
                    choice1_alt,
                    choice2,
                    choice3_alt,
                    choice4
                };

                var quiz1 = new Quiz
                {
                    Title = "CS130 First Quiz",
                    AssignedPoints = 15,
                    DateCreated = DateTime.Now.Date,
                    Creator = user1,
                    Choices = choices1
                };

                var quiz2 = new Quiz
                {
                    Title = "My Personal quiz",
                    AssignedPoints = 10,
                    DateCreated = DateTime.Now.Date,
                    Creator = user2,
                    Choices = choices2
                };

                context.Quizzes.AddRange(quiz1, quiz2);
                context.SaveChanges();

                var session2 = new Session
                {
                    TimeLimit = 150,
                    DateCreated = new DateTime(2017, 11, 1),
                    Results = new List<Result> {
                        new Result
                        {
                            Score = 15,
                            SessionParticipant = user1,
                            Choice = choice1
                        },

                        new Result
                        {
                            Score = 0,
                            SessionParticipant = user2,
                            Choice = choice2
                        }
                    },
                    Quiz = quiz1,
                    Status = SessionStatus.Complete,
                    GeneratedHostId = 1234
                };

                var session1 = new Session
                {
                    TimeLimit = 10,
                    DateCreated = new DateTime(2017, 10, 22),
                    Results = new List<Result> {
                        new Result
                        {
                            Score = 15,
                            SessionParticipant = user2,
                            Choice = choice3_alt
                        },

                        new Result
                        {
                            Score = 0,
                            SessionParticipant = user1,
                            Choice = choice1_alt
                        }
                    },
                    Quiz = quiz2,
                    Status = SessionStatus.Complete,
                    GeneratedHostId = 3456
                };


                context.Sessions.AddRange(session1, session2);

                context.SaveChanges();
            }
        }
    }
}
