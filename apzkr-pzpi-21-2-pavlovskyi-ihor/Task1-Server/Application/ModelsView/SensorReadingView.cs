using Microsoft.AspNetCore.Mvc;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using Application.Models;

namespace Application.ViewModels
{
    [NotMapped]
    public class SensorReadingView
    {
        public float Value { get; set; }
        public DateTime Timestamp { get; set; }
        public int SensorId { get; set; }
    }
}