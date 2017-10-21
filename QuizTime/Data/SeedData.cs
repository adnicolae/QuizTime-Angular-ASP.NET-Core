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

                context.Quizzes.AddRange(
                    new Quiz
                    {
                        Title = "CS130 First Quiz",
                        AssignedPoints = 15,
                        DateCreated = DateTime.Now.Date,
                        Creator = user1,
                        Choices = new List<Choice>
                        {
                            new Choice
                            {
                                Title = "Choice1",
                                Correctness = true,
                            },

                            new Choice
                            {
                                Title = "Choice2",
                                Correctness = false,
                            },

                            new Choice
                            {
                                Title = "Choice3",
                                Correctness = false,
                            },

                            new Choice
                            {
                                Title = "Choice4",
                                Correctness = false,
                            },
                        }
                    },

                    new Quiz
                    {
                        Title = "My Personal quiz",
                        AssignedPoints = 10,
                        DateCreated = DateTime.Now.Date,
                        Creator = user2,
                        Choices = new List<Choice>
                        {
                            new Choice
                            {
                                Title = "Choice1",
                                Correctness = false,
                            },

                            new Choice
                            {
                                Title = "Choice2",
                                Correctness = false,
                            },

                            new Choice
                            {
                                Title = "Choice3",
                                Correctness = true,
                            },

                            new Choice
                            {
                                Title = "Choice4",
                                Correctness = false,
                            },
                        }
                    }
                );

                context.SaveChanges();
            }
        }
    }
}
