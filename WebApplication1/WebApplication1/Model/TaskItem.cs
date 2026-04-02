using System;
using System.ComponentModel.DataAnnotations;

namespace WebApplication1.Model
{
    public class TaskItem
    {
        [Key]
        public int Id { get; set; }

        [Required(ErrorMessage = "Task title is required")]
        [StringLength(100)]
        public string Title { get; set; }

        [StringLength(500)]
        public string? Description { get; set; }

        public bool IsCompleted { get; set; } = false;

        [StringLength(20)]
        public string Priority { get; set; } = "Medium";


        public DateTime CreatedAt { get; set; } = DateTime.Now;

       
    }
}