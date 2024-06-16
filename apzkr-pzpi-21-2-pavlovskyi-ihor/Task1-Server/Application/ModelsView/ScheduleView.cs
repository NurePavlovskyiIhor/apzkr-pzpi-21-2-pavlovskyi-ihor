using Microsoft.AspNetCore.Mvc;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using Application.Models;

namespace Application.ViewModels
{
    [NotMapped]
    public class ScheduleView
    {
        public DateTime StartTime { get; set; }
        public DateTime EndTime { get; set; }
        public int SensorId { get; set; }
    }
}