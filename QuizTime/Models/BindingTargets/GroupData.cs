using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace QuizTime.Models.BindingTargets
{
    public class GroupData
    {
        [Required]
        [MaxLength(20, ErrorMessage = "Group title must be less than 21 characters.")]
        public string Title { get; set; }
        [Required]
        public string Owner { get; set; }
        [Required]
        public DateTime DateCreated { get; set; }

        public Group Group => new Group
        {
            Title = Title,
            DateCreated = DateCreated
        };
    }
}
