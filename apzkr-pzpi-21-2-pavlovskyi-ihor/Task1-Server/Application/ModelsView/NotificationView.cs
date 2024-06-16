using Microsoft.AspNetCore.Mvc;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using Application.Models;

namespace Application.ViewModels
{
    [NotMapped]
    public class NotificationView
    {
        public string Title { get; set; }
        public string Message { get; set; }
        public bool IsSent { get; set; }
        public int SensorReadingId { get; set; }
    }
}
