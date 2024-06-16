using Application.Models;
using Microsoft.AspNetCore.Mvc;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Application.ViewModels
{
    [NotMapped]
    public class GreenhouseView
    {
        public string Name { get; set; }
        public int UserId { get; set; }
    }
}