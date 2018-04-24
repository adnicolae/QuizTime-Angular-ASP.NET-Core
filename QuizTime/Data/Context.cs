using Microsoft.EntityFrameworkCore;
using QuizTime.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace QuizTime.Data
{
    public class Context : DbContext
    {
        public DbSet<Quiz> Quizzes { get; set; }
        public DbSet<User> Users { get; set; }
        public DbSet<Choice> Choices { get; set; }
        public DbSet<Session> Sessions { get; set; }
        public DbSet<Result> Results { get; set; }
        public DbSet<Group> Groups { get; set; }

        public Context(DbContextOptions<Context> options) : base(options)
        {

        }

        public Context()
        {
        }

        //protected override void OnModelCreating(ModelBuilder modelBuilder)
        //{
        //    modelBuilder.Entity<Result>().HasOne<User>(r => r.SessionParticipant).WithOne(u => )
        //}
    }
}
