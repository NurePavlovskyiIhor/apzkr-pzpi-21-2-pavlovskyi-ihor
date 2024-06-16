using Microsoft.AspNetCore.Mvc;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Application.Models
{
    public class Greenhouse
    {
        public int GreenhouseId { get; set; }
        public string Name { get; set; }

        [ForeignKey("UserId")]
        public User User { get; set; }
    }
}